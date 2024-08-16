// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Registry.sol";

contract Partnership {
    Registry private immutable _registry;
    address public immutable owner;

    struct PartnershipData {
        address payable brand;
        address payable influencer;
        uint256 amount;
        bool completed;
        bool brandConfirmed;
        bool influencerConfirmed;
    }

    uint256 private _nextPartnershipId = 1;
    mapping(uint256 => PartnershipData) public partnerships;
    mapping(address => uint256[]) public userPartnerships;

    event PartnershipCreated(uint256 indexed partnershipId, address indexed brand, address indexed influencer, uint256 amount);
    event PartnershipCompleted(uint256 indexed partnershipId);
    event PartnershipCancelled(uint256 indexed partnershipId);
    event PartnershipTransaction(uint256 indexed partnershipId, address indexed user, string action, bytes32 txHash);

    constructor(address registryAddress) {
        _registry = Registry(registryAddress);
        owner = msg.sender;
    }

    function createPartnership(address partnerAddress, uint256 amount) external payable {
        Registry.Partner memory creator = _registry.getPartnerInfo(msg.sender);
        Registry.Partner memory partner = _registry.getPartnerInfo(partnerAddress);

        require(creator.userType != partner.userType, "Partners must be of different types");

        address payable brandAddress;
        address payable influencerAddress;

        if (creator.userType == Registry.UserType.Brand) {
            brandAddress = payable(msg.sender);
            influencerAddress = payable(partnerAddress);
            require(msg.value == amount, "Incorrect amount sent");
        } else {
            brandAddress = payable(partnerAddress);
            influencerAddress = payable(msg.sender);
            require(msg.value == 0, "Influencer should not send funds");
        }

        uint256 partnershipId = _nextPartnershipId++;
        partnerships[partnershipId] = PartnershipData(
            brandAddress,
            influencerAddress,
            amount,
            false,
            false,
            false
        );

        userPartnerships[msg.sender].push(partnershipId);
        userPartnerships[partnerAddress].push(partnershipId);

        emit PartnershipCreated(partnershipId, brandAddress, influencerAddress, amount);
        emit PartnershipTransaction(
            partnershipId,
            msg.sender,
            "create",
            keccak256(abi.encodePacked(blockhash(block.number - 1), msg.sender, partnershipId))
        );
    }

    function getPartnership(uint256 partnershipId) external view returns (PartnershipData memory) {
        return partnerships[partnershipId];
    }

    function getUserPartnerships(address user) external view returns (uint256[] memory) {
        return userPartnerships[user];
    }

    function cancelPartnership(uint256 partnershipId) external {
        PartnershipData storage partnership = partnerships[partnershipId];
        require(!partnership.completed, "Partnership already completed");
        require(
            msg.sender == partnership.brand || msg.sender == partnership.influencer || msg.sender == owner,
            "Caller must be a party to the partnership or the owner"
        );

        if (partnership.amount > 0) {
            payable(partnership.brand).transfer(partnership.amount);
        }

        _removePartnershipFromUser(partnership.brand, partnershipId);
        _removePartnershipFromUser(partnership.influencer, partnershipId);

        delete partnerships[partnershipId];

        emit PartnershipCancelled(partnershipId);
        emit PartnershipTransaction(
            partnershipId,
            msg.sender,
            "cancel",
            keccak256(abi.encodePacked(blockhash(block.number - 1), msg.sender, partnershipId))
        );
    }

    function _removePartnershipFromUser(address user, uint256 partnershipId) private {
        uint256[] storage userPartnershipIds = userPartnerships[user];
        for (uint256 i = 0; i < userPartnershipIds.length; i++) {
            if (userPartnershipIds[i] == partnershipId) {
                userPartnershipIds[i] = userPartnershipIds[userPartnershipIds.length - 1];
                userPartnershipIds.pop();
                break;
            }
        }
    }

    function confirmPartnership(uint256 partnershipId) external {
        PartnershipData storage partnership = partnerships[partnershipId];
        require(
            partnership.brand == msg.sender || partnership.influencer == msg.sender,
            "Caller must be a party to the partnership"
        );
        require(!partnership.completed, "Partnership already completed");

        if (msg.sender == partnership.brand) {
            partnership.brandConfirmed = true;
        } else if (msg.sender == partnership.influencer) {
            partnership.influencerConfirmed = true;
        }

        if (partnership.brandConfirmed && partnership.influencerConfirmed) {
            uint256 amount = partnership.amount;
            partnership.completed = true;
            emit PartnershipCompleted(partnershipId);
            payable(partnership.influencer).transfer(amount);
        }
        emit PartnershipTransaction(
            partnershipId,
            msg.sender,
            "confirm",
            keccak256(abi.encodePacked(blockhash(block.number - 1), msg.sender, partnershipId))
        );
    }

    function getTotalPartnerships(address user) external view returns (uint256) {
        return userPartnerships[user].length;
    }

    function getCompletedPartnerships(address user) external view returns (uint256) {
        uint256 completedCount = 0;
        uint256[] memory partnershipIds = userPartnerships[user];
        for (uint256 i = 0; i < partnershipIds.length; i++) {
            if (partnerships[partnershipIds[i]].completed) {
                completedCount++;
            }
        }
        return completedCount;
    }

    function getTotalEthEarned(address user) external view returns (uint256) {
        uint256 totalEarned = 0;
        uint256[] memory partnershipIds = userPartnerships[user];
        for (uint256 i = 0; i < partnershipIds.length; i++) {
            PartnershipData memory partnership = partnerships[partnershipIds[i]];
            if (partnership.influencer == user && partnership.completed) {
                totalEarned += partnership.amount;
            }
        }
        return totalEarned;
    }
}
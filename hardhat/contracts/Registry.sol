// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IPartnership {
    function getUserPartnerships(address user) external view returns (uint256[] memory);
    function cancelPartnership(uint256 partnershipId) external;
}

contract Registry is Ownable {
    enum UserType { Influencer, Brand }

    struct Partner {
        string name;
        UserType userType;
    }

    mapping(address => Partner) public partners;
    mapping(address => bool) public registered;
    address[] public partnerAddresses;

    IPartnership private _partnership;

    event PartnerAdded(address indexed partner, string name, UserType userType);
    event PartnerRemoved(address indexed partner);
    event PartnershipSet(address indexed partnershipAddress);

    error AlreadyRegistered();
    error NotPartner();

    constructor() Ownable(msg.sender) {}

    function setPartnership(address partnershipAddress) external onlyOwner {
        _partnership = IPartnership(partnershipAddress);
        emit PartnershipSet(partnershipAddress);
    }

    function addPartner(string calldata name, UserType userType) external {
        if (registered[msg.sender]) revert AlreadyRegistered();
        partners[msg.sender] = Partner(name, userType);
        registered[msg.sender] = true;
        partnerAddresses.push(msg.sender);
        emit PartnerAdded(msg.sender, name, userType);
    }

    function removePartner(address partnerAddress) external onlyOwner {
        if (!registered[partnerAddress]) revert NotPartner();
        
        delete partners[partnerAddress];
        registered[partnerAddress] = false;

        _removePartnerAddress(partnerAddress);
        _cancelPartnerPartnerships(partnerAddress);

        emit PartnerRemoved(partnerAddress);
    }

    function isPartner(address _address) public view returns (bool) {
        return registered[_address];
    }

    function getAllPartners() public view returns (Partner[] memory) {
        Partner[] memory allPartners = new Partner[](partnerAddresses.length);
        for (uint256 i = 0; i < partnerAddresses.length; ++i) {
            allPartners[i] = partners[partnerAddresses[i]];
        }
        return allPartners;
    }

    function getPartnerInfo(address partner) public view returns (Partner memory) {
        if (!registered[partner]) revert NotPartner();
        return partners[partner];
    }

    function _removePartnerAddress(address partnerAddress) private {
        for (uint i = 0; i < partnerAddresses.length; i++) {
            if (partnerAddresses[i] == partnerAddress) {
                partnerAddresses[i] = partnerAddresses[partnerAddresses.length - 1];
                partnerAddresses.pop();
                break;
            }
        }
    }

    function _cancelPartnerPartnerships(address partnerAddress) private {
        uint256[] memory userPartnerships = _partnership.getUserPartnerships(partnerAddress);
        for (uint i = 0; i < userPartnerships.length; i++) {
            _partnership.cancelPartnership(userPartnerships[i]);
        }
    }
}
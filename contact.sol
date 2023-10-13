// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ContactManager {
    struct Contact {
        string name;
        string email;
    }

    address public owner;
    mapping(address => Contact[]) private userContacts;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function");
        _;
    }

    event ContactAdded(address indexed user, string name, string email);
    event ContactUpdated(address indexed user, uint256 contactIndex, string name, string email);
    event ContactDeleted(address indexed user, uint256 contactIndex);

    function addContact(string memory _name, string memory _email) public {
        userContacts[msg.sender].push(Contact(_name ,_email));
        emit ContactAdded(msg.sender, _name, _email);
    }

    function editContact(uint256 _contactIndex, string memory _name, string memory _email) public onlyOwner {
        require(_contactIndex < userContacts[msg.sender].length, "Invalid contact index");
        userContacts[msg.sender][_contactIndex] = Contact(_name,_email);
        emit ContactUpdated(msg.sender, _contactIndex, _name,  _email);
    }

    function deleteContact(uint256 _contactIndex) public onlyOwner {
        require(_contactIndex < userContacts[msg.sender].length, "Invalid contact index");
        emit ContactDeleted(msg.sender, _contactIndex);
        delete userContacts[msg.sender][_contactIndex];
    }

    function getContactCount() public view returns (uint256) {
        return userContacts[msg.sender].length;
    }

    function getContact(uint256 _contactIndex) public view returns (string memory, string memory) {
        require(_contactIndex < userContacts[msg.sender].length, "Invalid contact index");
        Contact storage contact = userContacts[msg.sender][_contactIndex];
        return (contact.name, contact.email);
    }

    function getAllContacts() public view returns (Contact[] memory) {
        return userContacts[msg.sender];
    }
}

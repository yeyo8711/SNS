// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {StringUtils} from "./StringUtils.sol";

contract Domains is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter public _tokenIds;
    string public tld;
    string public baseUri; //Base uri for metadata
    bool public whitelistOnly;

    mapping(string => address) public domains;
    mapping(string => Records) public records;
    mapping(uint256 => string) public tokenDomain;
    mapping(address => bool) public whitelisted;

    struct Records {
        string email;
        string url;
        string description;
        string avatar;
    }

    //http://mymetadata.com/
    constructor(
        string memory _tld,
        string memory _baseUri
    ) payable ERC721("Dippy Name Service", "DNS") {
        tld = _tld;
        baseUri = _baseUri;
        whitelistOnly = true;
    }

    function register(string calldata name) public payable {
        if (whitelistOnly) require(whitelisted[msg.sender]);
        require(domains[name] == address(0));
        require(validateName(name), "Not a valid name");

        //uint256 _price = price(name);
        // require(msg.value >= _price, "Not enough ETH paid");

        string memory _name = string(abi.encodePacked(baseUri, name, ".", tld));
        uint256 newRecordId = _tokenIds.current();
        tokenDomain[newRecordId] = name;

        _safeMint(msg.sender, newRecordId);
        _setTokenURI(newRecordId, _name);
        domains[name] = msg.sender;

        _tokenIds.increment();
    }

    // Getters and Setters
    ///@notice Token URI for metadata for token
    ///@param _tokenId token id
    function tokenURI(
        uint256 _tokenId
    )
        public
        view
        virtual
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        require(
            _exists(_tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        return
            bytes(baseUri).length > 0
                ? string(
                    abi.encodePacked(
                        baseUri,
                        string(
                            abi.encodePacked(tokenDomain[_tokenId], ".", tld)
                        )
                    )
                )
                : "";
    }

    function getAddress(string calldata name) public view returns (address) {
        return domains[name];
    }

    function setRecord(string calldata name, Records calldata record) public {
        require(domains[name] == msg.sender);
        records[name].avatar = record.avatar;
        records[name].description = record.description;
        records[name].email = record.email;
        records[name].url = record.url;
    }

    function getRecord(
        string calldata name
    ) public view returns (Records memory) {
        return records[name];
    }

    // Overrides required by solidity
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // Helpers
    function validateName(string memory str) internal pure returns (bool) {
        bytes memory b = bytes(str);
        if (b.length < 1) return false;
        if (b.length > 20) return false; // Cannot be longer than 20 characters
        if (b[0] == 0x20) return false; // Leading space
        if (b[b.length - 1] == 0x20) return false; // Trailing space

        for (uint i; i < b.length; i++) {
            bytes1 char = b[i];

            if (char == 0x20) return false; // Cannot contain  spaces

            if (
                !(char >= 0x30 && char <= 0x39) && //9-0
                !(char >= 0x61 && char <= 0x7A) && //a-z
                !(char == 0x2D) //- carriage return
            ) return false;
        }
        return true;
    }

    function price(string calldata name) public pure returns (uint) {
        uint len = StringUtils.strlen(name);
        require(len > 0);
        if (len < 4) {
            return 0.1 ether;
        } else if (len == 4) {
            return 0.15 ether;
        } else {
            return 0.2 ether;
        }
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MetaCourt {
    string public constant VERSION = "1.0.0";

    struct Case {
        string caseId;
        string complaintHash;
        uint256 validVotes;
        uint256 invalidVotes;
        uint256 needsEvidenceVotes;
        bool isDecided;
        string decision;
        uint256 filedAt;
        uint256 decidedAt;
    }

    address public owner;

    mapping(string => Case) private cases;
    mapping(string => bool) private caseExistsMap;

    string[] private allCaseIds;

    event CaseFiled(string indexed caseId, string complaintHash, uint256 timestamp);
    event VoteCast(string indexed caseId, string vote, uint256 timestamp);
    event DecisionReached(string indexed caseId, string decision, uint256 timestamp);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier caseExists(string memory caseId) {
        require(caseExistsMap[caseId], "Case does not exist");
        _;
    }

    modifier notDecided(string memory caseId) {
        require(!cases[caseId].isDecided, "Case already decided");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function fileCase(
        string memory caseId,
        string memory complaintHash
    ) public onlyOwner {
        require(!caseExistsMap[caseId], "Case already exists");
        require(bytes(caseId).length > 0, "Case ID required");
        require(bytes(complaintHash).length > 0, "Complaint hash required");

        cases[caseId] = Case({
            caseId: caseId,
            complaintHash: complaintHash,
            validVotes: 0,
            invalidVotes: 0,
            needsEvidenceVotes: 0,
            isDecided: false,
            decision: "pending",
            filedAt: block.timestamp,
            decidedAt: 0
        });

        caseExistsMap[caseId] = true;
        allCaseIds.push(caseId);

        emit CaseFiled(caseId, complaintHash, block.timestamp);
    }

    function castVote(
        string memory caseId,
        string memory vote
    ) public onlyOwner caseExists(caseId) notDecided(caseId) {
        bytes32 voteHash = keccak256(bytes(vote));

        if (voteHash == keccak256(bytes("valid"))) {
            cases[caseId].validVotes++;
        } else if (voteHash == keccak256(bytes("invalid"))) {
            cases[caseId].invalidVotes++;
        } else if (voteHash == keccak256(bytes("needs_evidence"))) {
            cases[caseId].needsEvidenceVotes++;
        } else {
            revert("Invalid vote option");
        }

        emit VoteCast(caseId, vote, block.timestamp);
    }

    function finalizeDecision(
        string memory caseId
    ) public onlyOwner caseExists(caseId) notDecided(caseId) {
        Case storage c = cases[caseId];

        if (
            c.validVotes > c.invalidVotes &&
            c.validVotes > c.needsEvidenceVotes
        ) {
            c.decision = "valid";
        } else if (
            c.invalidVotes > c.validVotes &&
            c.invalidVotes > c.needsEvidenceVotes
        ) {
            c.decision = "invalid";
        } else if (
            c.needsEvidenceVotes > c.validVotes &&
            c.needsEvidenceVotes > c.invalidVotes
        ) {
            c.decision = "needs_evidence";
        } else {
            c.decision = "tied";
        }

        c.isDecided = true;
        c.decidedAt = block.timestamp;

        emit DecisionReached(caseId, c.decision, block.timestamp);
    }

    function getCase(
        string memory caseId
    ) public view caseExists(caseId) returns (Case memory) {
        return cases[caseId];
    }

    function getCaseCount() public view returns (uint256) {
        return allCaseIds.length;
    }
}

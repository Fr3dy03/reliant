// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ReliantReceiptAnchor {
    event RunReceiptAnchored(
        bytes32 indexed projectId,
        bytes32 datasetVersionHash,
        bytes32 endpointVersionHash,
        bytes32 runSummaryHash,
        uint256 timestamp
    );

    function anchorRunReceipt(
        bytes32 projectId,
        bytes32 datasetVersionHash,
        bytes32 endpointVersionHash,
        bytes32 runSummaryHash
    ) external {
        emit RunReceiptAnchored(projectId, datasetVersionHash, endpointVersionHash, runSummaryHash, block.timestamp);
    }
}
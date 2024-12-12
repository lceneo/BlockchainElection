import { ethers } from "hardhat";

export const candidates = ["Tom Cruise", "Brad Pitt"].map(name => ethers.encodeBytes32String(name));

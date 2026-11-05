import "react-native-get-random-values";
import * as Crypto from "expo-crypto";
import { Buffer } from "buffer";

global.Buffer = Buffer;

// Ensure standard crypto global object is shimmed for ethers/ethers-related libraries
if (!global.crypto) {
  global.crypto = {};
}
if (!global.crypto.getRandomValues) {
  global.crypto.getRandomValues = (arr) => Crypto.getRandomValues(arr);
}

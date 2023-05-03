export const txToRx = (input: string) => {
  // Search for the first instance of "tx" in the input string
  const txIndex = input.indexOf("tx");

  // If "tx" is found, replace it with "rx" and return the modified string
  if (txIndex !== -1) {
    return input.slice(0, txIndex) + "rx" + input.slice(txIndex + 2);
  }

  // If "tx" is not found, return the input string unchanged
  return input;
}

export const rxToTx = (input: string) => {
  // Search for the first instance of "tx" in the input string
  const txIndex = input.indexOf("rx");

  // If "tx" is found, replace it with "rx" and return the modified string
  if (txIndex !== -1) {
    return input.slice(0, txIndex) + "tx" + input.slice(txIndex + 2);
  }

  // If "tx" is not found, return the input string unchanged
  return input;
}
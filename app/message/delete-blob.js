const deleteBlob = async (blockBlobClient) => {
  if (blockBlobClient) {
    await blockBlobClient.delete()
  }
}
module.exports = { deleteBlob }

// const { MAX_FILES } = require('../../app/constants/max-files')
const { handleFileLimitExceeded } = require('../../app/utils/file-checks/lenght-of-files-array-check')

describe('check length of files array', () => {
  // test('should throw an error when files array length is greater than MAX_FILES', () => {
  //   const result = handleFileLimitExceeded([1, 2, 3, 4, 5])
  //   expect(result.error).toBe(`Uploaded files must be less than ${MAX_FILES} files.`)
  // })

  test('should not throw an error when files array length is equal to MAX_FILES', () => {
    const result = handleFileLimitExceeded([0, 1, 2])
    expect(result.error).toBeUndefined()
  })

  test('should not throw an error when files array length is less than MAX_FILES', () => {
    const result = handleFileLimitExceeded([0, 1])
    expect(result.error).toBeUndefined()
  })
})

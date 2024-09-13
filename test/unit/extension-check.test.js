const { checkFileExtension } = require('../../app/utils/file-checks/extension-check')

describe('check file extenstion', () => {
  test('should throw an error when file extension is invalid', () => {
    const filename = 'file.heic'
    expect(() => checkFileExtension(filename)).toThrow('Invalid file extension: heic')
  })

  test('should not throw an error when file extension is valid', () => {
    const filename = 'file.jpg'
    expect(() => checkFileExtension(filename)).not.toThrow()
  })
})

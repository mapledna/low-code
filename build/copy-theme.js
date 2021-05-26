/* eslint-disable no-underscore-dangle */
const fs = require('fs')
const ora = require('ora')
const chalk = require('chalk')

const checkDir = (path, isMk) => {
  const isExists = fs.existsSync(path)
  if (isExists) return true
  if (!isMk) return false
  const mkErr = fs.mkdirSync(path)
  if (mkErr) throw mkErr
  return true
}

const srcDir = './dist/css'
const distDir = './dist/theme'
const publicDir = './public/theme'

const spinner = ora('copy theme file...\n\n')
spinner.start()

const isChecked = checkDir(srcDir, false)
if (!isChecked) {
  spinner.stop()
  console.log(chalk.red(`${srcDir} is not exists.Please run build first.`))
  console.log(chalk.red('Copy theme style files failed.\n'))
  process.exit()
}
checkDir(distDir, true)
checkDir(publicDir, true)

const copyList = []
const paths = fs.readdirSync(srcDir)
paths.forEach(path => {
  const matchArr = path.match(/^theme-(\w*)\.(\w*)\.css/)
  if (matchArr) {
    const srcPath = `${srcDir}/${matchArr[0]}`
    const st = fs.statSync(srcPath)
    // if (err) {
    //   spinner.stop()
    //   throw err
    // }
    if (st.isFile()) {
      const readable = fs.createReadStream(srcPath)
      const distPath = `${distDir}/theme-${matchArr[1]}.css`
      const publicPath = `${publicDir}/theme-${matchArr[1]}.css`
      const distWritable = fs.createWriteStream(distPath)
      const publicWritable = fs.createWriteStream(publicPath)
      readable.pipe(distWritable)
      readable.pipe(publicWritable)
      copyList.push(`copy ${srcPath} to ${distPath}, ${publicPath}`)
    }
  }
})

spinner.stop()
console.log(copyList.join('\n'))
console.log(chalk.cyan('Copy theme style files complete.\n'))

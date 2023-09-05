/**
 * 共通カラムなど1テーブルN件同一テーブルの参照先がある場合、
 * prismaが自動生成するフィールド名が好ましいものではないため、任意のフィールド名に置換します。
 */

import * as fs from 'fs'
import * as path from 'path'
import replacements from './replaceRelationFieldHash'

// 置換するprismaスキーマ
const schemaFile = path.join(__dirname, 'schema.prisma')

// 置換した文字列とその件数を追跡するための変数
let totalReplacements = 0

// ファイルを非同期で読み込む
fs.readFile(schemaFile, 'utf8', (err, data) => {
  if (err) {
    console.error(`schema.prismaの読み込みに失敗しました: ${err}`)
    return
  }

  // ファイル内容を置換
  let updatedData = data
  replacements.forEach(({ search, replace }) => {
    const regex = new RegExp(search, 'g')
    const matches = updatedData.match(regex)
    if (matches) {
      totalReplacements += matches.length
      updatedData = updatedData.replace(regex, replace)
      console.log(`フィールド'${search}'が${matches.length}件見つかりました`)
    } else {
      console.warn(`フィールド'${search}'は見つかりませんでした`)
    }
  })

  // 置換後のデータをファイルに書き込む
  fs.writeFile(schemaFile, updatedData, 'utf8', (err) => {
    if (err) {
      console.error(`schema.prismaの書き換えに失敗しました: ${err}`)
      return
    }

    console.log(`フィールド名の更新が終了しました`)
  })
})

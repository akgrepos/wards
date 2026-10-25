// pdftext.swift: saves a PDF's text (Mac PDFKit). Usage: swift pdftext.swift in.pdf out.txt
import Foundation
import PDFKit
let a = CommandLine.arguments
guard a.count == 3, let doc = PDFDocument(url: URL(fileURLWithPath: a[1])) else { print("cannot open"); exit(1) }
var out = ""
for i in 0..<doc.pageCount {
  if let p = doc.page(at: i), let s = p.string { out += "\n[page \(i + 1)]\n" + s }
}
try out.write(toFile: a[2], atomically: true, encoding: .utf8)
print("pages \(doc.pageCount) chars \(out.count)")

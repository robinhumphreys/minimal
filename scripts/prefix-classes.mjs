// One-off codemod: prefixes every class string (className, cn()/cva() args)
// with the embed's Tailwind prefix, e.g. `flex` becomes `ma:flex`.
//
//   node scripts/prefix-classes.mjs embed/**/*.tsx
import fs from "node:fs"
import ts from "typescript"

const PREFIX = "ma"
/** Classes the embed's own stylesheet defines by hand; not utilities. */
const SKIP = new Set(["minimal-agent-root"])
const CLASS_FNS = new Set(["cn", "clsx", "cva", "twMerge"])

function prefixToken(token) {
  if (SKIP.has(token) || token.startsWith(`${PREFIX}:`)) return token
  return `${PREFIX}:${token}`
}

/**
 * A token at the start of a template-literal continuation (`${x}-foo`) is
 * interpolated, so it's left alone unless `wholeStart` says it stands alone.
 */
function prefixList(text, wholeStart) {
  return text.replace(/\S+/g, (token, offset) =>
    offset === 0 && !wholeStart ? token : prefixToken(token),
  )
}

for (const file of process.argv.slice(2)) {
  const source = fs.readFileSync(file, "utf8")
  const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true)
  /** [start, end, replacement] over the raw source. */
  const edits = []
  /** Identifiers used in class position: their declarations are tables. */
  const tables = new Set()
  const seen = new Set()

  const literal = (node, start, end, wholeStart) => {
    if (seen.has(node)) return
    seen.add(node)
    const raw = source.slice(start, end)
    edits.push([start, end, prefixList(raw, wholeStart)])
  }

  const visitExpr = (node) => {
    if (!node) return
    if (ts.isStringLiteral(node)) {
      literal(node, node.getStart(sf) + 1, node.getEnd() - 1, true)
    } else if (ts.isNoSubstitutionTemplateLiteral(node)) {
      literal(node, node.getStart(sf) + 1, node.getEnd() - 1, true)
    } else if (ts.isTemplateExpression(node)) {
      const head = node.head
      literal(head, head.getStart(sf) + 1, head.getEnd() - 2, true)
      for (const span of node.templateSpans) {
        visitExpr(span.expression)
        const lit = span.literal
        const trailing = ts.isTemplateTail(lit) ? 1 : 2
        literal(lit, lit.getStart(sf) + 1, lit.getEnd() - trailing, false)
      }
    } else if (ts.isConditionalExpression(node)) {
      visitExpr(node.whenTrue)
      visitExpr(node.whenFalse)
    } else if (ts.isBinaryExpression(node)) {
      visitExpr(node.left)
      visitExpr(node.right)
    } else if (ts.isParenthesizedExpression(node) || ts.isAsExpression(node)) {
      visitExpr(node.expression)
    } else if (ts.isArrayLiteralExpression(node)) {
      node.elements.forEach(visitExpr)
    } else if (ts.isObjectLiteralExpression(node)) {
      // clsx-style `{ "flex": cond }`: the keys are the classes.
      for (const prop of node.properties) {
        if (ts.isPropertyAssignment(prop) && ts.isStringLiteral(prop.name)) {
          visitExpr(prop.name)
        }
      }
    } else if (ts.isArrowFunction(node) || ts.isFunctionExpression(node)) {
      if (ts.isBlock(node.body)) {
        node.body.forEachChild(function walk(child) {
          if (ts.isReturnStatement(child)) visitExpr(child.expression)
          else child.forEachChild(walk)
        })
      } else {
        visitExpr(node.body)
      }
    } else if (ts.isCallExpression(node)) {
      visitCall(node)
    } else if (ts.isIdentifier(node)) {
      tables.add(node.text)
    } else if (
      ts.isPropertyAccessExpression(node) ||
      ts.isElementAccessExpression(node)
    ) {
      // `SIZES[size]` / `SIZES.sm`: the table is what holds the classes.
      let root = node
      while (
        ts.isPropertyAccessExpression(root) ||
        ts.isElementAccessExpression(root)
      ) {
        root = root.expression
      }
      if (ts.isIdentifier(root)) tables.add(root.text)
    }
  }

  const visitCall = (node) => {
    const callee = node.expression
    if (!ts.isIdentifier(callee) || !CLASS_FNS.has(callee.text)) return
    if (callee.text === "cva") {
      visitExpr(node.arguments[0])
      const config = node.arguments[1]
      if (config && ts.isObjectLiteralExpression(config)) {
        for (const prop of config.properties) {
          if (!ts.isPropertyAssignment(prop)) continue
          const key = prop.name.getText(sf)
          if (
            key === "variants" &&
            ts.isObjectLiteralExpression(prop.initializer)
          ) {
            for (const axis of prop.initializer.properties) {
              if (
                ts.isPropertyAssignment(axis) &&
                ts.isObjectLiteralExpression(axis.initializer)
              ) {
                for (const option of axis.initializer.properties) {
                  if (ts.isPropertyAssignment(option))
                    visitExpr(option.initializer)
                }
              }
            }
          } else if (
            key === "compoundVariants" &&
            ts.isArrayLiteralExpression(prop.initializer)
          ) {
            for (const entry of prop.initializer.elements) {
              if (!ts.isObjectLiteralExpression(entry)) continue
              for (const field of entry.properties) {
                if (
                  ts.isPropertyAssignment(field) &&
                  /^(class|className)$/.test(field.name.getText(sf))
                ) {
                  visitExpr(field.initializer)
                }
              }
            }
          }
        }
      }
      return
    }
    node.arguments.forEach(visitExpr)
  }

  const visit = (node) => {
    if (ts.isJsxAttribute(node)) {
      const name = node.name.getText(sf)
      if (name === "class" || /className$/i.test(name)) {
        const init = node.initializer
        if (init && ts.isStringLiteral(init)) visitExpr(init)
        else if (init && ts.isJsxExpression(init)) visitExpr(init.expression)
      }
    } else if (ts.isCallExpression(node)) {
      visitCall(node)
    }
    ts.forEachChild(node, visit)
  }
  visit(sf)

  // Tables: `const SIZES = { sm: "size-8" }` or `const base = "flex"` read
  // from a class position. Values are classes; keys are names.
  const visitTable = (node) => {
    if (ts.isObjectLiteralExpression(node)) {
      for (const prop of node.properties) {
        if (ts.isPropertyAssignment(prop)) visitTable(prop.initializer)
      }
    } else if (ts.isAsExpression(node) || ts.isSatisfiesExpression?.(node)) {
      visitTable(node.expression)
    } else if (ts.isArrayLiteralExpression(node)) {
      node.elements.forEach(visitTable)
    } else {
      visitExpr(node)
    }
  }
  let before = -1
  while (tables.size !== before) {
    before = tables.size
    sf.forEachChild(function walk(node) {
      if (
        ts.isVariableDeclaration(node) &&
        ts.isIdentifier(node.name) &&
        tables.has(node.name.text) &&
        node.initializer
      ) {
        visitTable(node.initializer)
      }
      node.forEachChild(walk)
    })
  }

  edits.sort((a, b) => b[0] - a[0])
  let out = source
  for (const [start, end, text] of edits) {
    out = out.slice(0, start) + text + out.slice(end)
  }
  if (out !== source) fs.writeFileSync(file, out)
  console.log(`${file}: ${edits.length} strings`)
}

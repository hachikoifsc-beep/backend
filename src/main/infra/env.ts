
/**
 * Copyright (c) 2026 Hachiko Team from IFSC Xanxerê. All rights reserved.
 * 
 * This code was reased under the Creative Commons Zero v1.0 Universal license.
 * 
 * Part of the .env file parsing came from `dotenv` package, released under BSD-2-Clause license.
 * @see https://github.com/motdotla/dotenv
 * 
 * @autor Pagani
 */

import path from "node:path";
import * as fs from "node:fs";
import { homedir } from "node:os";


const LINE_PATTERN = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;


const allowedFilenames = [
  ".env",
  ".env.local",
  `.env.${process.env.NODE_ENV ?? "development"}`,
];

let rootPathString: string | null = null;


if(!process.env.DISALLOW_DOTENV) {
  const rc = fs.readdirSync($$root())
    .filter(item => allowedFilenames.includes(item));

  for(const filename of rc) {
    const contents = fs.readFileSync(path.join($$root(), filename), "utf8")
      .trim()
      .replace(/\r\n?/mg, "\n");

    let line: RegExpMatchArray | null = null;
    
    while((line = LINE_PATTERN.exec(contents)) != null) {
      const key = line[1];
      let value = String(line[2] || "").trim();

      const quote = value[0];
      value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");

      if(quote === "\"") {
        value = value.replace(/\\n/g, "\n")
          .replace(/\\r/g, "\r");
      }

      process.env[key] = value;
    }
  }
}


export function $$root(): string {
  if(rootPathString != null)
    return rootPathString;

  rootPathString = path.join(process.cwd(), "resources");

  if(process.env.NODE_ENV === "production" || !!process.env.VERCEL_ENV) {
    rootPathString = path.join(homedir(), ".hck");
  }

  if(!fs.existsSync(rootPathString)) {
    fs.mkdirSync(rootPathString, { recursive: true, mode: 0o755 });
  }

  return rootPathString;
}

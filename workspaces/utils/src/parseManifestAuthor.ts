export function manifestAuthorRegex(): RegExp {
  return /^([^<(]+?)?[ \t]*(?:<([^>(]+?)>)?[ \t]*(?:\(([^)]+?)\)|$)/gm;
}

export type ParsedMaintainer = {
  name: string;
  email?: string;
  url?: string;
};

/**
 * @see https://docs.npmjs.com/cli/v7/configuring-npm/package-json#people-fields-author-contributors
 */
export function parseManifestAuthor(
  manifestAuthorField: string
): ParsedMaintainer | null {
  if (typeof manifestAuthorField !== "string") {
    throw new TypeError("expected manifestAuthorField to be a string");
  }

  if (!/\w/.test(manifestAuthorField)) {
    return null;
  }

  const match = matchManifestAuthor(manifestAuthorField);
  if (!match) {
    return null;
  }
  const author: ParsedMaintainer = {
    name: match[1]
  };

  for (let id = 2; id < match.length; id++) {
    const val = match[id] || "";

    if (val.includes("@")) {
      author.email = val;
    }
    else if (val.includes("http")) {
      author.url = val;
    }
  }

  return author;
}

function matchManifestAuthor(manifestAuthorField: string) {
  const match = manifestAuthorRegex().exec(manifestAuthorField);
  if (match) {
    return match;
  }

  return manifestAuthorRegex().exec(manifestAuthorField.split(",")[0]);
}

export function parseAuthor(author: any): ParsedMaintainer | null {
  if (typeof author === "string") {
    return parseManifestAuthor(author);
  }

  return !author || Object.keys(author).length === 0 ? null : author;
}

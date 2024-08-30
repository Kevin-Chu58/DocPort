const DocType = {
    Doc: "doc",
    ContentHolder: "contentHolder",
}

const DocTypeExpression = {
    Doc: "Doc",
    ContentHolder: "Content Holder",
};

const DocTypeMap = new Map([
  [DocType.Doc, DocTypeExpression.Doc],  
  [DocType.ContentHolder, DocTypeExpression.ContentHolder],  
]);

export {
  DocType,
  DocTypeMap as DocTypeExpression,
};
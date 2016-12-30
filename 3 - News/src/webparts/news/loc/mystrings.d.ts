declare interface INewsStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  NewsLibraryNameFieldLabel: string;
  SelectPropertiesFieldLabel: string;
  ContentTypeFieldLabel: string;
  NumberOfArticlesToShowFieldLabel: string;
}

declare module 'newsStrings' {
  const strings: INewsStrings;
  export = strings;
}

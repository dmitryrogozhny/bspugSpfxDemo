import pnp from "sp-pnp-js";

export interface INewsItem {
  id: number;
  title: string;
  pageUrl: string;
  publishedDate?: Date;
  imageUrl?: string;
  isPromoted?: boolean;
  summary?: string;
}

interface IPageListItem {
  Title: string;
  Id: number;
  FileRef: string;
  BannerImageUrl: {Description: string, Url: string};
  PromotedState: number;
  FirstPublishedDate?: Date;
}

export default class NewsItemsStore {

  private static getMappings: (string) => Array<{key: string, value: string}> = (value: string) => {
    const mapping: Array<{key: string, value: string}> = value.split(",").map((key) => {
      const mappingPair: string[] = key.split(":");

      return {key: mappingPair[0], value: mappingPair[1]};
    });

    return mapping;
  }

  public static getNewsItems(newsLibraryName: string, selectProperties: string, contentType: string, numberOfArticlesToShow: number): Promise<Array<INewsItem>> {

    const mappings = this.getMappings(selectProperties);
    let properties = "";

    mappings.forEach((mapping, index) => {
      properties += mapping.value;

      if (index < mappings.length - 1) {
         properties += ",";
      }
    });

    return new Promise<Array<INewsItem>>((resolve, reject) => {
      pnp.sp.web.lists.getByTitle(newsLibraryName)
      .items
      .select(properties)
      .filter(`(ContentType eq '${contentType}') and (PromotedState eq 2)`)
      .top(numberOfArticlesToShow)
      .get()
      .then((items: Array<IPageListItem>) => {
        const newsItems: Array<INewsItem> = items.map((item: IPageListItem) => {
          const ni = {};

          for (const key in item) {
            for (const mapping of mappings) {
              if (mapping.value === key) {
                ni[mapping.key] = item[key];
              }
            }
          }

          ni["imageUrl"] = item.BannerImageUrl.Url;
          return ni as INewsItem;
        });

        resolve(newsItems);
      });
    });
  }
}
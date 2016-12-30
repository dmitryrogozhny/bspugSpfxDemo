import * as React from 'react';

import styles from '../News.module.scss';
import { INewsWebPartProps } from '../INewsWebPartProps';

import NewsItemsStore, {INewsItem} from "../stores/NewsItemsStore";
import NewsArticle from "./NewsArticle";

export interface INewsProps extends INewsWebPartProps {
}

export interface INewsState {
  newsItems: Array<INewsItem>;
}

export default class News extends React.Component<INewsProps, INewsState> {

  constructor() {
    super();
    this.state = {newsItems: []};
  }

  private getLatestNews(newsLibraryName, selectProperties, contentType, numberOfArticlesToShow) {
    NewsItemsStore.getNewsItems(newsLibraryName, selectProperties, contentType, numberOfArticlesToShow).then((newsItems: Array<INewsItem>) => {
      this.setState({newsItems: newsItems});
    });
  }

/* tslint:disable:no-unused-variable */

  private componentDidMount() {
    this.getLatestNews(this.props.newsLibraryName, this.props.selectProperties, this.props.contentType, this.props.numberOfArticlesToShow);
  }

/* tslint:enable:no-unused-variable */

/* tslint:disable:no-unused-variable */

  private componentWillReceiveProps(nextProps: INewsProps) {
    if ((nextProps.newsLibraryName != this.props.newsLibraryName) ||
      (nextProps.numberOfArticlesToShow != this.props.numberOfArticlesToShow) ||
      (nextProps.selectProperties != this.props.selectProperties)) {
        console.log("will update " + nextProps.numberOfArticlesToShow);
        this.getLatestNews(nextProps.newsLibraryName, nextProps.selectProperties, nextProps.contentType, nextProps.numberOfArticlesToShow);
    }
  }

/* tslint:enable:no-unused-variable */

  public render(): JSX.Element {
    const articles = this.state.newsItems.map((newsItem, index) => {
      return (
        <NewsArticle newsItem={newsItem} isPromoted={index === 0} key={newsItem.id} />
      );
    });

    return (
      <section className={styles.news}>
        {articles}
      </section>
    );
  }
}

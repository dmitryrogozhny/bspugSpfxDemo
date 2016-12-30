import * as React from "react";

import { css } from "office-ui-fabric-react";
import styles from "../News.module.scss";

import {INewsItem} from "../stores/NewsItemsStore";

export interface INewsArticleProps {
  newsItem: INewsItem;
  isPromoted: boolean;
}

export interface INewsArticleState {}

export class NewsArticle extends React.Component<INewsArticleProps, INewsArticleState> {
  public render(): JSX.Element {
    return (
        <article className={css(styles.feature, {[styles.first]: this.props.isPromoted})}>
          <div className={styles.content}>
            <span className={styles.imageHolder}>
              <a href="#">
                <img alt="alt" src={this.props.newsItem.imageUrl}>
                </img>
              </a>
            </span>
            <div className={styles.text}>
              <p className={styles.meta}>
                <time className="date" dateTime="2016-10-24T12:20:00+01:00">24 October 2016</time> — Speech
              </p>
              <h2 className={styles.title}>
                <a href={this.props.newsItem.pageUrl}>{this.props.newsItem.title}</a>
              </h2>
              <p className={styles.summary}>
                Minister for the Constitution Chris Skidmore sets out his vision of a democracy that works for everyone in the United Kingdom.
              </p>
            </div>
          </div>
        </article>
    );
  }
}

export default NewsArticle;

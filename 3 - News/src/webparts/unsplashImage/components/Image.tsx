import * as React from "react";
import styles from "../UnsplashImage.module.scss";

/**
 * Properties for the {Image} component.
 *
 * @export
 * @interface IImageProps
 */
export interface IImageProps {
  src: string;
  alt: string;
  caption: string;
}

/**
 * State of the {Image} component.
 *
 * @export
 * @interface IImageState
 */
export interface IImageState { }

/**
 * Displays an image.
 *
 * @export
 * @class Image
 * @extends {React.Component<IImageProps, IImageState>}
 */
export default class Image extends React.Component<IImageProps, IImageState> {
  public render(): JSX.Element {
    return (
      <div className={styles.unsplashImage}>
        <figure className={styles.figure}>
          <img src={this.props.src} alt={this.props.alt} className={styles.image} />
          <figcaption>{this.props.caption}</figcaption>
        </figure>
      </div>
    );
  }
}

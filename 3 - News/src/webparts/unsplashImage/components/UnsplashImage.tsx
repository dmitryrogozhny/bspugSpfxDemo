import * as React from 'react';

import Image from "./Image";
import ImageEditor from "./ImageEditor";

import { IUnsplashImageWebPartProps } from '../IUnsplashImageWebPartProps';

import { DisplayMode, BasicHttpClient } from '@microsoft/sp-client-base';

/**
 * Properties for the {UnsplashImage} component.
 *
 * @export
 * @interface IUnsplashImageProps
 * @extends {IUnsplashImageWebPartProps}
 */
export interface IUnsplashImageProps extends IUnsplashImageWebPartProps {
  httpClient: BasicHttpClient;
  displayMode: DisplayMode;
  onImageChange: (imageCategory: string, imageUrl: string) => void;
}

/**
 * State of the {UnsplashImage} component.
 *
 * @export
 * @interface IUnsplashImageState
 */
export interface IUnsplashImageState {
  selectedCategory?: string;
  images?: Array<string>;
  selectedImageIndex?: number;

  isLoadingImage?: boolean;
}

const serviceUrl = "https://source.unsplash.com/category/";
// resolution of photos.
const serviceUlrEnd = "/800x400";
const categoriesList: Array<string> = ["buildings", "food", "nature", "people", "technology", "objects"];
const defaultCategory = "nature";

const pauseTime = 1000;

/**
 * Allows to select and view images from the unsplash.com site.
 *
 * @export
 * @class UnsplashImage
 * @extends {React.Component<IUnsplashImageProps, IUnsplashImageState>}
 */
export default class UnsplashImage extends React.Component<IUnsplashImageProps, IUnsplashImageState> {

  constructor(props: IUnsplashImageProps) {
    super(props);

    const images = [];

    let selectedImageIndex;
    let selectedCategory;

    if (props.imageUrl) {
      images.push(props.imageUrl);

      selectedImageIndex = 0;
      selectedCategory = props.imageCategory;
    } else {
      selectedImageIndex = -1;
      selectedCategory = defaultCategory;
    }

    this.state = { images: images, selectedCategory: selectedCategory, selectedImageIndex: selectedImageIndex, isLoadingImage: false };
  }

  /* tslint:disable:no-unused-variable */
  private componentDidMount() {
    // Initialize new image load if no url has been provided via properties.
    if (this.state.selectedImageIndex === -1) {
      this.onCategoryChanged(defaultCategory);
    }
  }
  /* tslint:enable */

  private onCategoryChanged = (category: string) => {
    this.getUnsplashImage(category, 0);
  }

  private onNextClick = () => {
    const selectedImageIndex = this.state.selectedImageIndex;

    // If no next image, request new from the unsplash.com site.
    // Otherwise set next image in the list as selected.
    if (selectedImageIndex !== this.state.images.length - 1) {
      this.setState({ selectedImageIndex: selectedImageIndex + 1 });
    } else {
      this.getUnsplashImage(this.state.selectedCategory, 0);
    }
  }

  private onPrevClick = () => {
    const selectedImageIndex = this.state.selectedImageIndex;

    if (selectedImageIndex > 0) {
      this.setState({ selectedImageIndex: selectedImageIndex - 1 });
    }
  }

  private readonly isNextEnabled = () => true;
  private readonly isPrevEnabled = () => this.state.selectedImageIndex !== 0;

/**
 * Helper method that gets the image by its index with boundary checks.
 *
 * @private
 * @param {Array<string>} images
 * @param {number} index
 * @returns {string}
 *
 * @memberOf UnsplashImage
 */
  private getImageUrl(images: Array<string>, index: number): string {
    let imageUrl = "";

    if ((this.state.images.length !== 0) && (this.state.selectedImageIndex !== -1)) {
      imageUrl = this.state.images[this.state.selectedImageIndex];
    }

    return imageUrl;
  }

  private readonly getServiceUrl = (category) => serviceUrl + category + serviceUlrEnd;

/**
 * Get image from the unsplash.com by category, and save it to the state.
 *
 * @private
 * @param {string} category
 * @param {number} retryCount
 *
 * @memberOf UnsplashImage
 */
  private getUnsplashImage(category: string, retryCount: number) {
    const url = this.getServiceUrl(category);

    this.setState({ isLoadingImage: true, selectedCategory: category });

    this.props.httpClient.get(url)
      .then((response) => {
        const newImageUrl = response.url;

        // unsplash.com may return the image that is already in the list.
        // In this case, try to get another image.
        if (this.state.images.indexOf(newImageUrl) === -1) {
          // If category hasn't changed, add the image to the existing images list.
          // Otherwise start a new list for a newly selected category.
          if (category === this.state.selectedCategory) {
            const images = this.state.images;
            const selectedImageIndex = this.state.selectedImageIndex + 1;
            const selectedCategory = this.state.selectedCategory;

            images.push(newImageUrl);

            this.setState({ images: images, selectedCategory: selectedCategory, selectedImageIndex: selectedImageIndex, isLoadingImage: false }, () => {
              this.props.onImageChange(this.state.selectedCategory, this.getImageUrl(this.state.images, this.state.selectedImageIndex));
            });
          } else {
            const images = [];
            const selectedImageIndex = 0;
            const selectedCategory = category;

            images.push(newImageUrl);

            this.setState({ images: images, selectedCategory: selectedCategory, selectedImageIndex: selectedImageIndex, isLoadingImage: false }, () => {
              this.props.onImageChange(this.state.selectedCategory, this.getImageUrl(this.state.images, this.state.selectedImageIndex));
            });
          }

        } else {
          // Image already in the list, wait for some time and get another image.
          setTimeout( () => {
            this.getUnsplashImage(category, ++retryCount);
          }, pauseTime);
        }
      })
      .catch((reason) => {
        // Process error
        console.error(reason);
      });
  }

  public render(): JSX.Element {
    const imageUrl = this.getImageUrl(this.state.images, this.state.selectedImageIndex);

    // Select a component to render depending on the display mode.
    switch (this.props.displayMode) {
      case DisplayMode.Read:
        return <Image
          src={imageUrl}
          alt={this.props.alternateText}
          caption={this.props.caption}
        />;
      case DisplayMode.Edit:
        return <ImageEditor
          imageUrl={imageUrl}
          alternateText={this.props.alternateText}
          caption={this.props.caption}
          categories={categoriesList}
          selectedCategory={this.state.selectedCategory}

          onNextClick={this.onNextClick}
          onPrevClick={this.onPrevClick}
          onCategoryChanged={this.onCategoryChanged}

          isPrevEnabled={this.isPrevEnabled()}
          isNextEnabled={this.isNextEnabled()}
          isLoadingImage={this.state.isLoadingImage}
        />;
      default:
        console.error("Unknown display mode: " + this.props.displayMode);
        return null;
    }
  }
}

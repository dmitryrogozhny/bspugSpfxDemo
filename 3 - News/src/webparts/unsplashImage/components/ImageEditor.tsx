import * as React from "react";
import { css } from "office-ui-fabric-react";
import styles from "../UnsplashImage.module.scss";

import Image from "./Image";

import { Dropdown, IDropdownOption } from "office-ui-fabric-react/lib/Dropdown";
import { Spinner, SpinnerType } from "office-ui-fabric-react/lib/Spinner";

/**
 * Properties for the {ImageEditor} component.
 *
 * @export
 * @interface IImageEditorProps
 */
export interface IImageEditorProps {
  categories: Array<string>;
  selectedCategory: string;
  imageUrl: string;
  alternateText: string;
  caption: string;

  onNextClick: () => void;
  onPrevClick: () => void;
  onCategoryChanged: (newCategory: string) => void;

  isLoadingImage: boolean;
  isNextEnabled: boolean;
  isPrevEnabled: boolean;
}

/**
 * State of the {ImageEditor} component.
 *
 * @export
 * @interface IImageEditorState
 */
export interface IImageEditorState {
}

/**
 * Allows to specify a category and select an image.
 *
 * @export
 * @class ImageEditor
 * @extends {React.Component<IImageEditorProps, IImageEditorState>}
 */
export default class ImageEditor extends React.Component<IImageEditorProps, IImageEditorState> {

  public readonly optionsList: IDropdownOption[] = this.props.categories.map(
    (category) => { return { key: category, text: category }; }
  );

  public readonly onCategoryChanged = (option: IDropdownOption) => {
    if (this.props.selectedCategory !== option.key) {
      this.props.onCategoryChanged(option.key.toString());
    }
  };
  public readonly onArrowClick = (handler: () => void, isArrowEnabled: boolean) => isArrowEnabled ? handler : null;

  public render(): JSX.Element {
    return (
      <div className={styles.unsplashImage}>
        <div className={styles.container}>
          <Dropdown
            label="Select category:"
            options={this.optionsList}
            selectedKey={this.props.selectedCategory}
            onChanged={this.onCategoryChanged}
            />

          <div className={css(styles.imageContainer, {[styles.loadingImage]: !(this.props.imageUrl)})}>
            <Image src={this.props.imageUrl} alt={this.props.alternateText} caption={this.props.caption} />
            <i
              className={css("ms-Icon", "ms-Icon--ChevronLeft", styles.arrow, styles.leftArrow, { [styles.arrowDisabled]: !this.props.isPrevEnabled })}
              onClick={this.onArrowClick(this.props.onPrevClick, this.props.isPrevEnabled && !this.props.isLoadingImage)}
              />
            <i
              className={css("ms-Icon", "ms-Icon--ChevronRight", styles.arrow, styles.rightArrow, { [styles.arrowDisabled]: !this.props.isNextEnabled })}
              onClick={this.onArrowClick(this.props.onNextClick, this.props.isNextEnabled && !this.props.isLoadingImage)}
              />
            <Spinner type={SpinnerType.large} className={css(styles.spinner, { [styles.spinnerHidden]: !this.props.isLoadingImage })} />
          </div>
        </div>
      </div>
    );
  }
}

import * as React from 'react'

export interface IResizableProps extends React.Props<Resizable> {

  width: number

  /** The maximum width the panel can be resized to.
   *
   * @default 350
   */
  maximumWidth?: number

  /**
   * The minimum width the panel can be resized to.
   *
   * @default 150
   */
  minimumWidth?: number

  /** The optional ID for the root element. */
  id?: string

  /**
   * Handler called when the width of the component has changed
   * through an explicit resize event (dragging the handle).
   */
  readonly onResize?: (newWidth: number) => void

  /**
   * Handler called when the resizable component has been
   * reset (ie restored to its original width by double clicking
   * on the resize handle).
   */
  readonly onReset?: () => void
}

interface IResizableState {
  /**
   * The width of the panel in pixels.
   * Optional
   */
  width?: number
}

/**
 * Component abstracting a resizable panel.
 *
 * Handles user resizing and persistence of the width.
 */
export class Resizable extends React.Component<IResizableProps, IResizableState> {

  public static defaultProps: IResizableProps = {
    width: 250,
    minimumWidth: 150,
    maximumWidth: 350,
  }

  private startWidth: number | null
  private startX: number

  private getCurrentWidth() {
    return this.clampWidth(this.props.width)
  }

  private clampWidth(width: number) {
    return Math.max(this.props.minimumWidth!, Math.min(this.props.maximumWidth!, width))
  }

  /**
   * Handler for when the user presses the mouse button over the resize
   * handle.
   *
   * Note: This method is intentionally bound using `=>` so that
   * we can avoid creating anonymous functions repeatedly in render()
   */
  private handleDragStart = (e: React.MouseEvent<any>) => {
    this.startX = e.clientX
    this.startWidth = this.getCurrentWidth() || null

    document.addEventListener('mousemove', this.handleDragMove)
    document.addEventListener('mouseup', this.handleDragStop)
  }

  /**
   * Handler for when the user moves the mouse while dragging
   *
   * Note: This method is intentionally bound using `=>` so that
   * we can avoid creating anonymous functions repeatedly in render()
   */
  private handleDragMove = (e: MouseEvent) => {
    const deltaX = e.clientX - this.startX

    const newWidth = this.startWidth + deltaX
    const newWidthClamped = this.clampWidth(newWidth)

    if (this.props.onResize) {
      this.props.onResize(newWidthClamped)
    }
  }

  /**
   * Handler for when the user lets go of the mouse button during
   * a resize operation.
   *
   * Note: This method is intentionally bound using `=>` so that
   * we can avoid creating anonymous functions repeatedly in render()
   */
  private handleDragStop = (e: MouseEvent) => {
    document.removeEventListener('mousemove', this.handleDragMove)
    document.removeEventListener('mouseup', this.handleDragStop)
  }

  /**
   * Handler for when the resize handle is double clicked.
   *
   * Resets the panel width to its default value and clears
   * any persisted value.
   *
   * Note: This method is intentionally bound using `=>` so that
   * we can avoid creating anonymous functions repeatedly in render()
   */
  private handleDoubleClick = () => {
    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  public render() {

    const style: React.CSSProperties = {
      width: this.getCurrentWidth(),
      maximumWidth: this.props.maximumWidth,
      minimumWidth: this.props.minimumWidth,
    }

    return (
      <div id={this.props.id} className='resizable-component' style={style}>
        {this.props.children}
        <div onMouseDown={this.handleDragStart} onDoubleClick={this.handleDoubleClick} className='resize-handle'></div>
      </div>
    )
  }
}

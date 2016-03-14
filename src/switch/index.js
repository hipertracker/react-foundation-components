import React, { Component, PropTypes, Children, cloneElement, isValidElement } from 'react';
import cx from 'classnames';
import cxBinder from 'classnames/bind';
import uncontrollable from 'uncontrollable/batching';
import includes from 'lodash/includes';
import isNil from 'lodash/isNil';
import isBlank from 'underscore.string/isBlank';

import { COMPONENT_SIZES } from '../util/constants';
import { ShowForScreenReader, HideForScreenReader } from '../visibility';
import styles from './_styles.scss';

const cxStyles = cxBinder.bind(styles);

function createCheckedLabel(baseClassName) {
  class SwitchCheckedLabel extends Component {
    static propTypes = {
      className: PropTypes.string,
    };

    render() {
      const { className } = this.props;
      const classNames = cx(className, cxStyles(baseClassName));

      return (
        <HideForScreenReader {...this.props} className={classNames} />
      );
    }
  }

  return SwitchCheckedLabel;
}

export const SwitchCheckedLabel = createCheckedLabel('switch-active');
SwitchCheckedLabel.displayName = 'SwitchCheckedLabel';

export const SwitchUncheckedLabel = createCheckedLabel('switch-inactive');
SwitchUncheckedLabel.displayName = 'SwitchUncheckedLabel';

export class SwitchPadelLabel extends Component {
  render() {
    return <ShowForScreenReader {...this.props} />;
  }
}

export class Switch extends Component {
  static propTypes = {
    checked: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
    containerClassName: PropTypes.string,
    containerStyle: PropTypes.object,
    eventKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    onToggle: PropTypes.func,
    paddleClassName: PropTypes.string,
    paddleStyle: PropTypes.object,
    size: PropTypes.oneOf(COMPONENT_SIZES),
  };

  setInputRef = (inputRef) => {
    this._inputRef = inputRef;
  };

  handleLabelClick = (...args) => {
    const { checked, eventKey, id, onChange, onToggle } = this.props;

    if (onChange) {
      onChange(...args);
    }

    if (isBlank(id)) {
      if (isNil(checked)) {
        this._inputRef.click();
      } else if (onToggle) {
        onToggle(eventKey);
      }
    }
  };

  handleInputChange = (...args) => {
    const { eventKey, id, onChange, onToggle } = this.props;

    if (onChange) {
      onChange(...args);
    }

    if (!isBlank(id) && onToggle) {
      onToggle(eventKey);
    }
  };

  render() {
    const {
      children,
      className,
      containerClassName,
      containerStyle,
      id,
      paddleClassName,
      paddleStyle,
      size,
    } = this.props;
    const containerClassNames =
      cx(containerClassName, cxStyles('switch', { [size]: includes(COMPONENT_SIZES, size) }));
    const classNames = cx(className, cxStyles('switch-input'));
    const paddleClassNames = cx(paddleClassName, cxStyles('switch-paddle'));

    return (
      <div className={containerClassNames} style={containerStyle}>
        <input
          {...this.props}
          children={null}
          className={classNames}
          onChange={this.handleInputChange}
          ref={this.setInputRef}
          size={null}
          type="checkbox"
        />
        <label
          className={paddleClassNames}
          htmlFor={id}
          onClick={this.handleLabelClick}
          style={paddleStyle}
        >
          {children}
        </label>
      </div>
    );
  }
}

class RadioSwitchControlled extends Component {
  static propTypes = {
    activeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    children: PropTypes.node,
    onSelect: PropTypes.func,
    size: PropTypes.oneOf(COMPONENT_SIZES),
  };

  handleToggle = (...args) => {
    const { onSelect } = this.props;

    if (onSelect) {
      onSelect(...args);
    }
  };

  render() {
    const { activeKey, children, size } = this.props;
    const newChildren = Children.map(children, (child) => {
      if (isValidElement(child) && !isBlank(child.props.eventKey)) {
        return cloneElement(child, {
          checked: child.props.eventKey === activeKey,
          onToggle: this.handleToggle,
          size,
        });
      }

      return child;
    });

    return (
      <div {...this.props}>{newChildren}</div>
    );
  }
}

export const RadioSwitch = uncontrollable(RadioSwitchControlled, { activeKey: 'onSelect' });
RadioSwitch.displayName = 'RadioSwitch';

Switch.Radio = RadioSwitch;
Switch.CheckedLabel = SwitchCheckedLabel;
Switch.UncheckedLabel = SwitchUncheckedLabel;
Switch.PadelLabel = SwitchPadelLabel;

export default Switch;
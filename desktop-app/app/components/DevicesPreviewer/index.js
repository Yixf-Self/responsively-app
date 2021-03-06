// @flow
import React, {Fragment, useState, useEffect} from 'react';
import cx from 'classnames';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import Renderer from '../Renderer';

import styles from './style.module.css';
import {
  HORIZONTAL_LAYOUT,
  FLEXIGRID_LAYOUT,
  INDIVIDUAL_LAYOUT,
} from '../../constants/previewerLayouts';
import {isDeviceEligible} from '../../utils/filterUtils';
import {getDeviceIcon} from '../../utils/iconUtils';

export default function DevicesPreviewer(props) {
  const {
    browser: {
      devices,
      address,
      zoomLevel,
      previewer: {layout},
    },
  } = props;
  const [activeTab, changeTab] = useState(0);

  return (
    <div className={cx(styles.container)}>
      {layout === INDIVIDUAL_LAYOUT && (
        <Tabs onSelect={changeTab}>
          <TabList>
            {devices
              .map(device => {
                if (!isDeviceEligible(device, props.browser.filters)) {
                  return null;
                }
                return (
                  <Tab tabId={device.id} key={device.id}>
                    {getDeviceIcon(device.type)}
                    {device.name}
                  </Tab>
                );
              })
              .filter(Boolean)}
          </TabList>
        </Tabs>
      )}
      <div
        className={cx(styles.devicesContainer, {
          [styles.flexigrid]: layout === FLEXIGRID_LAYOUT,
          [styles.horizontal]: layout === HORIZONTAL_LAYOUT,
        })}
      >
        {devices.map((device, index) => (
          <div
            key={device.id}
            className={cx({
              [styles.tab]: layout === INDIVIDUAL_LAYOUT,
              [styles.activeTab]:
                layout === INDIVIDUAL_LAYOUT && activeTab === index,
            })}
          >
            <Renderer
              hidden={!isDeviceEligible(device, props.browser.filters)}
              device={device}
              src={address}
              zoomLevel={zoomLevel}
              transmitNavigatorStatus={index === 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

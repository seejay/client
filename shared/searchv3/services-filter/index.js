// @flow
// The filter bar for search. Lets you select a search provider
import * as Constants from '../../constants/searchv3'
import React, {Component} from 'react'
import {Box, Icon, ClickableBox} from '../../common-adapters'
import {globalColors, globalStyles} from '../../styles'
import {isMobile} from '../../constants/platform'

type Props = {|
  selectedService: Constants.Service,
  onSelectService: (service: Constants.Service) => void,
|}

const bubbleColors = {
  Facebook: '#3B5998',
  GitHub: '#333333',
  'Hacker News': '#FF6600',
  Keybase: globalColors.blue,
  Reddit: '#CEE3F8',
  Twitter: '#1DA1F2',
}

const servicesOrder = ['Keybase', 'Twitter', 'Facebook', 'GitHub', 'Reddit', 'Hacker News']
const selectedIconMap = isMobile ? Constants.serviceToIcon24 : Constants.serviceToIcon16
const unselectedIconMap = isMobile ? Constants.serviceToIcon24BW : Constants.serviceToIcon16BW

const Service = ({service, selected, hovering, onHover, onSelect}) => {
  let backgroundColor

  if (hovering && !selected) {
    backgroundColor = globalColors.blue4
  } else if (selected) {
    backgroundColor = bubbleColors[service]
  }

  const boxProps = isMobile
    ? {
        onPressIn: () => onHover(service, true),
        onPressOut: () => onHover(service, false),
        style: {
          ...globalStyles.flexBoxCenter,
          backgroundColor,
          borderRadius: 20,
          height: 40,
          width: 40,
        },
      }
    : {
        onMouseEnter: () => onHover(service, true),
        onMouseLeave: () => onHover(service, false),
        style: {
          ...globalStyles.flexBoxCenter,
          backgroundColor,
          borderRadius: 16,
          height: 32,
          width: 32,
        },
      }

  return (
    <ClickableBox key={service} onClick={() => onSelect(service)} {...boxProps}>
      <Icon type={selected ? selectedIconMap[service] : unselectedIconMap[service]} />
    </ClickableBox>
  )
}

// Holds all the services and keeps track of which one is hovered
class Filter extends Component<void, Props, {hoveredService: ?Constants.Service}> {
  state = {
    hoveredService: null,
  }

  _hoverChanged = (service: Constants.Service, hovering: boolean) => {
    if (hovering) {
      this.setState({hoveredService: service})
    } else if (this.state.hoveredService === service) {
      this.setState({hoveredService: null})
    }
  }

  _selectService = (service: Constants.Service) => {
    this.props.onSelectService(service)
  }

  render() {
    return (
      <Box style={{...globalStyles.flexBoxRow}}>
        {servicesOrder.map((service: Constants.Service) => (
          <Service
            key={service}
            service={service}
            selected={service === this.props.selectedService}
            hovering={service === this.state.hoveredService}
            onHover={this._hoverChanged}
            onSelect={this._selectService}
          />
        ))}
      </Box>
    )
  }
}

export default Filter

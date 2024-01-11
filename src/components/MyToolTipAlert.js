import {View, Text, TouchableHighlight, TouchableOpacity} from 'react-native';
import React from 'react';
import Tooltip from 'react-native-walkthrough-tooltip';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../config/Constants';

const MyToolTipAlert = props => {
  return (
    <Tooltip
      isVisible={props.visible}
      content={<Text>{props.text}</Text>}
      placement={props.placement}
      onClose={() => props.setToolTipVisible(false)}>
      <TouchableOpacity activeOpacity={0.8} onPress={()=>props.setToolTipVisible(true)}>
        <Ionicons name='alert-circle' color={colors.red_color1} size={20} />
      </TouchableOpacity>
    </Tooltip>
  );
};

export default MyToolTipAlert;

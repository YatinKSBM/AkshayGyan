import {View, Text} from 'react-native';
import React from 'react';
import ChartComponent from './ChartComponent';
import {useState} from 'react';
import {useEffect} from 'react';
import axios from 'axios';
import {api2_get_chart, api_url} from '../../../config/Constants';
import MyLoader from '../../../components/MyLoader';

const Akshvedansha = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState(null);
  useEffect(() => {
    get_charts();
  }, []);

  const get_charts = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api2_get_chart,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        kundli_id: props.route.params.data.kundali_id,
        chartid: 'D45',
      },
    })
      .then(res => {
        setIsLoading(false);
        setChartData(res.data.svg);
        console.log(res.data);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  return (
    <View style={{flex: 1}}>
      <MyLoader isVisible={isLoading} />
      {chartData && (
        <ChartComponent
          svg={chartData}
          title="Akshvedansha"
          planetData={props.route.params.planetData}
        />
      )}
    </View>
  );
};

export default Akshvedansha;

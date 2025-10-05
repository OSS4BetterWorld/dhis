import { useEffect, useState } from 'react';
import mqtt from 'mqtt';
import { useToast } from '@/hooks/use-toast';

export interface MonitoringMetric {
  label: string;
  value: string;
  status: "normal" | "warning" | "alert";
}

export interface MonitoringData {
  category: string;
  metrics: MonitoringMetric[];
}

const MQTT_BROKER = 'wss://test.mosquitto.org:8081'; // Public test broker

export const useMqttMonitoring = () => {
  const [monitoringData, setMonitoringData] = useState<MonitoringData[]>([
    {
      category: "Weather Data",
      metrics: [
        { label: "Rainfall", value: "45mm/hr", status: "warning" },
        { label: "Wind Speed", value: "65 km/h", status: "normal" },
        { label: "Temperature", value: "28°C", status: "normal" },
      ],
    },
    {
      category: "Geological",
      metrics: [
        { label: "Seismic Activity", value: "2.1 magnitude", status: "normal" },
        { label: "Volcanic Activity", value: "Low", status: "normal" },
        { label: "Ground Movement", value: "Stable", status: "normal" },
      ],
    },
    {
      category: "Hydrological",
      metrics: [
        { label: "River Level", value: "8.2m", status: "warning" },
        { label: "Dam Capacity", value: "78%", status: "normal" },
        { label: "Groundwater", value: "Normal", status: "normal" },
      ],
    },
    {
      category: "Satellite Data",
      metrics: [
        { label: "Fire Hotspots", value: "3 detected", status: "alert" },
        { label: "Storm Tracking", value: "2 systems", status: "warning" },
        { label: "Cloud Cover", value: "65%", status: "normal" },
      ],
    },
  ]);
  
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    console.log('Connecting to MQTT broker:', MQTT_BROKER);
    
    const client = mqtt.connect(MQTT_BROKER, {
      clientId: `disaster_monitor_${Math.random().toString(16).slice(2, 10)}`,
      clean: true,
      reconnectPeriod: 5000,
    });

    client.on('connect', () => {
      console.log('MQTT connected successfully');
      setIsConnected(true);
      
      // Subscribe to disaster monitoring topics
      const topics = [
        'disaster/weather/#',
        'disaster/geological/#',
        'disaster/hydrological/#',
        'disaster/satellite/#'
      ];
      
      topics.forEach(topic => {
        client.subscribe(topic, (err) => {
          if (err) {
            console.error('Subscribe error:', err);
          } else {
            console.log('Subscribed to:', topic);
          }
        });
      });

      toast({
        title: "Real-time Monitoring Active",
        description: "Connected to MQTT data stream",
      });
    });

    client.on('message', (topic, message) => {
      console.log('Received MQTT message:', topic, message.toString());
      
      try {
        const data = JSON.parse(message.toString());
        updateMonitoringData(topic, data);
      } catch (error) {
        console.error('Error parsing MQTT message:', error);
      }
    });

    client.on('error', (error) => {
      console.error('MQTT error:', error);
      setIsConnected(false);
    });

    client.on('close', () => {
      console.log('MQTT connection closed');
      setIsConnected(false);
    });

    // Simulate real-time data updates every 5 seconds
    const simulationInterval = setInterval(() => {
      simulateDataUpdate();
    }, 5000);

    return () => {
      clearInterval(simulationInterval);
      client.end();
    };
  }, []);

  const updateMonitoringData = (topic: string, data: any) => {
    setMonitoringData(prev => {
      const newData = [...prev];
      
      if (topic.includes('weather')) {
        const weatherIndex = newData.findIndex(d => d.category === "Weather Data");
        if (weatherIndex !== -1 && data.metric && data.value && data.status) {
          const metricIndex = newData[weatherIndex].metrics.findIndex(m => m.label === data.metric);
          if (metricIndex !== -1) {
            newData[weatherIndex].metrics[metricIndex] = {
              label: data.metric,
              value: data.value,
              status: data.status
            };
          }
        }
      }
      
      return newData;
    });
  };

  const simulateDataUpdate = () => {
    setMonitoringData(prev => {
      const newData = [...prev];
      
      // Randomly update a metric
      const categoryIndex = Math.floor(Math.random() * newData.length);
      const metricIndex = Math.floor(Math.random() * newData[categoryIndex].metrics.length);
      
      const metric = newData[categoryIndex].metrics[metricIndex];
      
      // Generate slight variations in values
      if (metric.label === "Rainfall") {
        const current = parseFloat(metric.value);
        const newValue = Math.max(0, current + (Math.random() - 0.5) * 10);
        newData[categoryIndex].metrics[metricIndex].value = `${newValue.toFixed(0)}mm/hr`;
        newData[categoryIndex].metrics[metricIndex].status = newValue > 50 ? "alert" : newValue > 30 ? "warning" : "normal";
      } else if (metric.label === "Wind Speed") {
        const current = parseFloat(metric.value);
        const newValue = Math.max(0, current + (Math.random() - 0.5) * 15);
        newData[categoryIndex].metrics[metricIndex].value = `${newValue.toFixed(0)} km/h`;
        newData[categoryIndex].metrics[metricIndex].status = newValue > 80 ? "alert" : newValue > 60 ? "warning" : "normal";
      } else if (metric.label === "River Level") {
        const current = parseFloat(metric.value);
        const newValue = Math.max(0, current + (Math.random() - 0.5) * 0.5);
        newData[categoryIndex].metrics[metricIndex].value = `${newValue.toFixed(1)}m`;
        newData[categoryIndex].metrics[metricIndex].status = newValue > 9 ? "alert" : newValue > 7.5 ? "warning" : "normal";
      }
      
      return newData;
    });
  };

  return { monitoringData, isConnected };
};

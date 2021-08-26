import React, { useEffect, useState } from 'react';
import { Button, makeStyles, Slider, Text, useTheme } from 'react-native-elements';
import LocalizationContext from '../../../LanguageContext';
import { useUserSettings } from '../../hooks/useUserSettings';
import { HEALTHKIT } from '../Settings/glucoseSourceConstants';
import { TextInput, View } from 'react-native';
import OutLineButton from '../../Common/OutLineButton';
import Modal from 'react-native-modal';
import moment from 'moment';

const HealthKitAddInsulin = props => {
  const { t } = React.useContext(LocalizationContext);
  const styles = useStyles();
  const { theme } = useTheme();
  const { userSettings } = useUserSettings();
  const defaultValue =
    props.healthKitData.insulin && props.healthKitData.insulin.value
      ? props.healthKitData.insulin.value
      : null;
  const defaultMinutes =
    props.healthKitData.insulin && props.healthKitData.insulin.minutes
      ? props.healthKitData.insulin.minutes
      : 0;
  const [value, setValue] = useState(defaultValue);
  const [date, setDate] = useState(formateDate(defaultMinutes));
  const [open, setOpen] = useState(false);
  const [minutes, setMinutes] = useState(defaultMinutes || null);
  const buttonTitle = `${
    props.healthKitData.insulin.value ? props.healthKitData.insulin.value + ' Units of' : ''
  } Insulin `;

  function formateDate(n) {
    const calcDate = moment(props.date).add(n, 'minutes');

    const time = calcDate.format('hh:mm');
    const dateString = new Date(calcDate).toDateString();
    return { time: calcDate, date: dateString, timeString: time };
  }

  useEffect(() => {
    setDate(formateDate(minutes));
  }, [minutes]);

  useEffect(() => {
    console.log('Update Add HealthKIT', props.healthKitData);
    setValue(defaultValue);
    setMinutes(defaultMinutes);
    setDate(formateDate(defaultMinutes));
  }, [props.healthKitData]);

  return userSettings.glucoseSource === HEALTHKIT ? (
    <View style={styles.container}>
      <View style={styles.buttonWrapper}>
        <Button
          type={props.healthKitData.insulin && props.healthKitData.insulin.value ? 'solid' : 'outline'}
          buttonStyle={
            props.healthKitData.insulin && props.healthKitData.insulin.value
              ? { paddingHorizontal: 20, backgroundColor: '#ffd420' }
              : { paddingHorizontal: 20, backgroundColor: 'transparent' }
          }
          title={buttonTitle}
          onPress={() => {
            setOpen(true);
          }}
        />
      </View>

      <Modal
        animationIn="slideInUp"
        animationOut="slideOutDown"
        isVisible={open}
        backdropOpacity={0.3}
        onBackdropPress={() => setOpen(false)}
        style={styles.modal}
        onAccessibilityEscape={() => setOpen(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.date}>
              {date.date} {date.timeString}
            </Text>
            <Text h2>
              {minutes > 0 ? minutes + ' minutes after meal' : Math.abs(minutes) + ' minutes before meal'}
            </Text>
            <Slider
              step={1}
              minimumValue={-60}
              maximumValue={30}
              value={minutes}
              style={styles.slider}
              onValueChange={num => setMinutes(num)}
              thumbTintColor={theme.colors.primary}
              thumbStyle={{ height: 20, width: 20 }}
            />
            <View style={styles.searchInputContainer}>
              <TextInput
                textContentType={'location'}
                clearButtonMode={'unless-editing'}
                style={styles.input}
                returnKeyType={'done'}
                placeholder={'Insulin Einheiten'}
                returnKeyLabel={'done'}
                value={value}
                keyboardType={'numeric'}
                onChangeText={num => setValue(num)}
              />
            </View>
            <View style={{ flexGrow: 1 }} />

            <Button
              title={'Save'}
              onPress={() => {
                props.setHealthKitData(prevState => {
                  return {
                    carbs: prevState.carbs,
                    insulin: { date: date.time, value: value, minutes: minutes },
                  };
                });
                setOpen(false);
              }}
            />
            <OutLineButton type={'clear'} title={t('General.close')} onPress={() => setOpen(false)} />
          </View>
        </View>
      </Modal>
    </View>
  ) : null;
};

export default HealthKitAddInsulin;

const useStyles = makeStyles(theme => ({
  container: {
    alignSelf: 'flex-start',
    marginLeft: theme.spacing.S,
    marginBottom: theme.spacing.L,
  },
  centeredView: {
    //flex: 1,
    // height:300,
    justifyContent: 'center',
  },
  modalView: {
    margin: theme.spacing.S,
    backgroundColor: 'white',
    height: '70%',
    borderRadius: 20,
    padding: theme.spacing.S,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  slider: {
    marginHorizontal: theme.spacing.S,
    marginVertical: theme.spacing.L,
  },
  searchInputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: { marginVertical: theme.spacing.M },
  input: {
    height: 40,
    marginLeft: 20,
    flex: 1,
  },
  buttonWrapper: { margin: theme.spacing.S },
}));

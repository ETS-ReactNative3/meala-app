import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import {Button, FAB, makeStyles} from 'react-native-elements';
import {database} from '../../Common/database_realm';
import moment from 'moment';
import auth from '@react-native-firebase/auth';
import analytics from '@react-native-firebase/analytics';
import MealInputField from './EnterMealComponents/MealInputField';
import RestaurantInputField from './EnterMealComponents/RestaurantInputField';
import {uploadImageToServer} from './EnterMealComponents/imageUploadToServer';
import LocalizationContext from '../../../LanguageContext';
import {DatePickerOverlay} from './EnterMealComponents/DatePickerOverlay';
import {useFocusEffect, useNavigation} from '@react-navigation/core';
import ScanScreen from './BarCodeScanner/BarCodeScannerScreen';
import PictureSelector from './PictureSelector';
import {Tags} from './EnterMealComponents/Tags';
import {mealTypeByTime} from '../../utils/timeOfDay';
import FatSecretUserDataModal from './EnterMealComponents/FatSecretUserDataModal';
import {COMMUNITY_MEALS_URL} from '@env';
import {addTimeBasedTags} from './addTimebasedTags';
import {getExistingFatSecretProfileData} from './getExistingFatSecretProfileData';
import {checkGps} from './checkGPS';
import {reminderNotification} from './ReminderNotification';
import HeaderRightIconGroup from './HeaderRightIconGroup';
import {uploadToNightScout} from './uploadToNightScout';
import NightScoutInputFields from './NightScoutTreatmentsInputFields';
import HealthKitInputField from './HealthKitInputField';
import NoteInputField from './NoteInputField';
import {spacing} from '../../theme/styles';
import uuid from 'react-native-uuid';
import {useUserSettings} from '../../hooks/useUserSettings';

//process.nextTick = setImmediate;
var pageTitle = null;

const EnterMeal = ({route}, props) => {
  const {t, locale} = React.useContext(LocalizationContext);
  const navigation = useNavigation();
  moment.locale(locale);
  const styles = useStyles(props);
  const {userSettings} = useUserSettings();
  const [user_id, setUser_id] = useState('');

  const [avatarSourceLibrary, setAvatarSourceLibrary] = useState(undefined);
  const [avatarSourceCamera, setAvatarSourceCamera] = useState(undefined);

  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantId, setRestaurantId] = useState('');
  const [mealTitle, setMealTitle] = useState('');

  const [note, setNote] = useState('');
  const [carbs, setCarbs] = useState(null);
  const [nsTreatmentsUpload, setNsTreatmentsUpload] = useState(null);
  const [foodPicture, setFoodPicture] = useState('');
  const [base64ImageData, setBase64ImageData] = useState('');
  const [predictions, setPredictions] = useState([]);

  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');

  const [date, setDate] = useState(new Date());

  const [cMeals, setCMeals] = useState([]);
  const [mealIsFocused, setMealIsFocused] = useState(false);

  const [mealId, setMealId] = useState(uuid.v4());
  const [userMealId, setUserMealId] = useState(uuid.v4());

  const [scope, setScope] = useState('');

  const [isLoadingcMeals, setIsLoadingcMeals] = useState(true);

  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const scrollListReftop = useRef();
  const MealInput = useRef();
  const [gpsEnabled, setGpsEnabled] = useState(true);
  const [tags, setTags] = useState([]);
  const [fatSecretData, setFatSecretData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  console.log(editMode);
  React.useEffect(() => {
    if (route.params?.scan === true) {
      console.log('Scan param ' + route.params.scan);
      setIsScannerVisible(prevState => true);
      route.params.scan = false;
    }
  }, [route.params?.scan]);

  useFocusEffect(
    React.useCallback(() => {
      if (route.params.type !== 'edit') {
        setDate(new Date());
      }
      return () => {
        pageTitle = null;
      };
    }, []),
  );
  useEffect(() => {
    if (route.params?.mealid) {
      database.fetchMealbyId(route.params.mealid).then(data => {
        const tags = data.tags.map(data => {
          return {
            id: uuid.v4(),
            name: data.tagEn,
            active: true,
          };
        });
        const fatSecretFromDB = data.fatSecretUserFoodEntryIds.map(
          data => data.foodEntryId,
        );
        const fatSecretDataExists = fatSecretFromDB.length > 0;
        fatSecretDataExists && setFatSecretData(fatSecretFromDB);
        setTags(tags);
        setMealTitle(data.food);
        if (route.params.type === 'edit') {
          setUserMealId(data.userMealId);
          //   setRestaurantId(data.restaurantId);
          setMealId(data.id);
        }
        setFoodPicture(data.picture);
        setAvatarSourceCamera(data.picture ? {uri: data.picture} : undefined);
        // setCarbs(data.carbs); depends on source
        setNote(data.note);
        database
          .getRestaurantName(data.restaurantId)
          .then(name => setRestaurantName(name));
      });
    }
  }, [route.params?.mealid, route.params?.type]);

  React.useLayoutEffect(() => {
    if (route.params?.mealid) {
      if (route.params?.type) {
        console.log(route.params.type);
        if (route.params.type === 'edit') {
          setEditMode(true);
          route.params.type = null;
        } else if (route.params.type === 'copy') {
          setEditMode(false);
        } else {
          setEditMode(prev => false);
        }
      }
    }

    navigation.setOptions({
      title: editMode ? 'Edit' : t('AddMeal.AddMealTitle'),
      headerRight: () => (
        <HeaderRightIconGroup reset={reset} saveAll={saveAll} />
      ),
    });
    return () => {};
  }, [navigation, route.params.type, editMode]);

  useEffect(() => {
    if (route.params?.id) {
      setRestaurantId(prevState => route.params.id);
      console.log('Scan param ' + route.params.id);
      database
        .getRestaurantName(route.params.id)
        .then(name => setRestaurantName(name));
    }
  }, [route.params?.id]);

  //todo: move to app
  useEffect(() => {
    auth()
      .signInAnonymously()
      .then(data => {
        setUser_id(data.user.uid);
      });
  }, []);

  useEffect(() => {
    // add Breakfast | Lunch | Dinner to Tags and replace if Date updates
    addTimeBasedTags(tags, setTags, date, t);
    getExistingFatSecretProfileData(date, setFatSecretData);
  }, [date]);

  useFocusEffect(
    React.useCallback(() => {
      checkGps(setLng, setLat, setGpsEnabled);
    }, [gpsEnabled]),
  );

  function cancel() {
    reset();
    navigation.setParams({mealid: null, type: null});
    navigation.goBack();
  }

  const handleScannerFood = data => {
    setRestaurantName(prevState => t('General.various'));
    setRestaurantId(prevState => t('General.various'));
    setNote(data.note ? data.note : null);
    setMealId(uuid.v4());
    setUserMealId(uuid.v4());
    setMealTitle(data.meal);
  };

  const offset = Platform.OS === 'android' ? -200 : 64;

  const loadCommunityMeals = id => {
    fetch(COMMUNITY_MEALS_URL + id)
      .then(response => response.json())
      .then(data => {
        setCMeals(data);
        setIsLoadingcMeals(false);
      })
      .catch(error => {
        setCMeals([]);
        setIsLoadingcMeals(false);
      });
  };

  function saveAll() {
    const fatSecretUserIds = fatSecretData
      ? fatSecretData
          .filter(data => data.checked)
          .map(data => {
            return {foodEntryId: data.food_entry_id};
          })
      : [];

    uploadToNightScout(nsTreatmentsUpload, note, userSettings, date);

    const defaultMealTitle = mealTitle || mealTypeByTime(date, t);
    const defaultRestaurantName = restaurantName || t('AddMeal.home');
    const defaultRestaurantId = restaurantId || t('AddMeal.home');

    reminderNotification(userMealId, mealId, t, defaultMealTitle);

    const restaurantData = {
      base64ImageData: base64ImageData,
      user_id,
      restaurantName,
      restaurantId,
      mealTitle,
      picId: foodPicture,
      lat,
      lng,
      mealId,
      userMealId,
      scope,
      carbs,
      predictions,
      date,
    };
    console.log(restaurantData);
    if (route.params?.type && route.params.type === 'edit') {
      // database.editRestaurant(defaultRestaurantId, restaurantName, scope);
      database
        .editMeal(userMealId, mealTitle, foodPicture, date, note)
        .then(() => {
          reset();
          navigation.navigate('meala');
        });
    } else {
      database
        .saveRestaurant(
          defaultRestaurantName,
          defaultRestaurantId,
          defaultMealTitle,
          foodPicture,
          note,
          lat,
          lng,
          mealId,
          userMealId,
          scope,
          carbs,
          tags,
          date,
          fatSecretUserIds,
        )
        .then(() => uploadImageToServer(restaurantData))
        .then(() =>
          analytics().logEvent('Save_Restaurant', {
            Meal: defaultMealTitle,
            Restaurant: defaultRestaurantName,
          }),
        )
        .then(() => {
          reset();
          navigation.navigate('meala');
        });
    }
  }

  const handleInputMealChange = text => setMealTitle(text);

  const handleRestaurantPress = (restaurant, id, scopeInfo) => {
    setRestaurantName(restaurant);
    setRestaurantId(id);
    setScope(scopeInfo);
    setMealIsFocused(true);
    loadCommunityMeals(id);
    Keyboard.dismiss();
  };

  const handleRestaurantName = text => {
    setRestaurantName(text);
    setRestaurantId(text);
  };

  const handleMealInputFocus = () => {
    setMealIsFocused(true);
    scrollListReftop.current.scrollTo({x: 0, y: 100, animated: true});
  };

  const handleMealInputBlur = () => setMealIsFocused(false);
  const handleMealPress = (meal, id) => {
    setMealTitle(meal);
    setMealId(id);
    setMealIsFocused(false);
    Keyboard.dismiss();
  };

  function reset() {
    setEditMode(false);

    const newDate = new Date();
    setAvatarSourceLibrary(undefined);
    setAvatarSourceCamera(undefined);
    setRestaurantName('');
    setRestaurantId('');
    setMealTitle('');
    setNote('');
    setCarbs(null);
    setFoodPicture('');
    setBase64ImageData('');
    setNsTreatmentsUpload(null);
    setPredictions([]);

    setCMeals([]);
    setMealIsFocused(true);
    setMealId(uuid.v4());
    setUserMealId(uuid.v4());
    setScope('');

    setIsLoadingcMeals(true);
    const newMealID = uuid.v4();
    const newuserMealId = uuid.v4();
    setMealId(newMealID);
    setUserMealId(newuserMealId);
    setDate(newDate);

    setTags([]);
  }

  function addTag(newTag) {
    setTags(prevArray => [
      ...prevArray,
      {
        id: uuid.v4(),
        name: newTag,
        active: true,
      },
    ]);
  }

  function removeTag(id) {
    setTags(prevArray =>
      prevArray.map(data => {
        if (data.id === id) {
          return {
            id: data.id,
            name: data.name,
            active: false,
          };
        } else {
          return {
            ...data,
          };
        }
      }),
    );
  }

  const [visible, setVisible] = useState(false);

  return isScannerVisible ? (
    <ScanScreen
      toggleScanner={() => setIsScannerVisible(false)}
      handleScannerFood={handleScannerFood}
    />
  ) : (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior="padding"
      enabled
      keyboardVerticalOffset={offset}>
      <ScrollView
        bounces={false}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        ref={scrollListReftop}
        scrollToOverflowEnabled={true}
        contentContainerStyle={styles.container}>
        <PictureSelector
          setFoodPicture={setFoodPicture}
          setClarifaiImagebase={setBase64ImageData}
          setDate={setDate}
          setPredictions={setPredictions}
          setTags={setTags}
          avatarSourceCamera={avatarSourceCamera}
          setAvatarSourceCamera={setAvatarSourceCamera}
          avatarSourceLibrary={avatarSourceLibrary}
          setAvatarSourceLibrary={setAvatarSourceLibrary}
          setIsScannerVisible={setIsScannerVisible}
        />

        <DatePickerOverlay date={date} setDate={setDate} />
        <RestaurantInputField
          editMode={editMode}
          restaurantName={restaurantName}
          handleRestaurantPress={handleRestaurantPress}
          handleRestaurantName={handleRestaurantName}
          lat={lat}
          lng={lng}
          gpsEnabled={gpsEnabled}
        />

        <View style={styles.spacing}>
          {fatSecretData && (
            <>
              <Button
                buttonStyle={styles.fatSecretButton}
                title={
                  t('AddMeal.fatSecretUserEntries.button') +
                  (fatSecretData.filter(data => data.checked).length > 0
                    ? ` (${fatSecretData.filter(data => data.checked).length})`
                    : '')
                }
                onPress={() => setVisible(true)}
              />

              <FatSecretUserDataModal
                fatSecretData={fatSecretData}
                setFatSecretData={setFatSecretData}
                visible={visible}
                setVisible={setVisible}
              />
            </>
          )}
        </View>
        <MealInputField
          MealInput={MealInput}
          mealIsFocused={mealIsFocused}
          isLoadingcMeals={isLoadingcMeals}
          cMeals={cMeals}
          handleMealPress={handleMealPress}
          handleMealInputFocus={handleMealInputFocus}
          handleInputMealChange={handleInputMealChange}
          Gericht={mealTitle}
          predictions={predictions}
          handleMealInputBlur={handleMealInputBlur}
        />
        <HealthKitInputField carbs={carbs} setCarbs={setCarbs} />

        <NightScoutInputFields
          nsTreatmentsUpload={nsTreatmentsUpload}
          setNsTreatmentsUpload={setNsTreatmentsUpload}
        />
        <NoteInputField notiz={note} setNotiz={setNote} />
        <Tags tags={tags} handleTags={addTag} removeTag={removeTag} />
      </ScrollView>
      <FAB
        title={editMode ? t('AddMeal.edit') : t('AddMeal.save')}
        onPress={() => saveAll()}
        size={'small'}
        placement={'right'}
        icon={{name: 'save', color: 'black'}}
      />
      {editMode && (
        <FAB
          title={'Abbrechen'}
          onPress={() => cancel()}
          size={'small'}
          placement={'left'}
          icon={{name: 'save', color: 'black'}}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default EnterMeal;

const useStyles = makeStyles((theme, props: Props) => ({
  wrapper: {flexGrow: 1, height: '100%'},

  spacing: {
    alignItems: 'flex-start',
    paddingHorizontal: spacing.L,
    marginBottom: spacing.M,
  },
  fatSecretButton: {paddingHorizontal: spacing.L},
  container: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
}));

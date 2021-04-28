import React, {useState} from 'react';
import {Platform, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {makeStyles, SearchBar} from 'react-native-elements';
import LocalizationContext from '../../../../LanguageContext';
import Modal from 'react-native-modal';
import {useScreenReader} from '../../../hooks/useScreenReaderEnabled';

export const Tags = props => {
  const [visible, setVisible] = useState(false);
  const [tag, setTag] = useState('');
  const {t} = React.useContext(LocalizationContext);
  const screenReaderEnabled = useScreenReader();
  const styles = useStyles();

  function add() {
    if (tag.length > 0 && tag !== ' ') {
      props.handleTags(tag);
    }
    setTag('');
    setVisible(false);
  }

  const exampleTags = !screenReaderEnabled
    ? [
        {id: 1, tag: '😡', type: 'emoji'},
        {id: 2, tag: '😍', type: 'emoji'},
        {
          id: 3,
          tag: '🤣',
          type: 'emoji',
        },
        {id: 4, tag: '😀', type: 'emoji'},
        {id: 5, tag: '🤢', type: 'emoji'},
        {id: 6, tag: '😴', type: 'emoji'},
        {
          id: 7,
          tag: '🛀',
          type: 'emoji',
        },
        {id: 8, tag: '🎮', type: 'emoji'},
        {id: 9, tag: '💩', type: 'emoji'},
        {id: 10, tag: '🥖', type: 'emoji'},
        {
          id: 11,
          tag: '🍦',
          type: 'emoji',
        },
        {id: 12, tag: '🎰', type: 'emoji'},
        {id: 13, tag: '🎉', type: 'emoji'},
        {id: 14, tag: '🍕', type: 'emoji'},
        {
          id: 15,
          tag: '🍺',
          type: 'emoji',
        },
        {id: 16, tag: '🍸', type: 'emoji'},
        {id: 17, tag: '🏀', type: 'emoji'},
        {id: 18, tag: '🍷', type: 'emoji'},
        {
          id: 19,
          tag: '🚙',
          type: 'emoji',
        },
        {id: 20, tag: '🚅', type: 'emoji'},
        {id: 21, tag: t('AddMeal.tag.basalrate'), type: 'text'},
      ]
    : [];

  return (
    <>
      <View style={{display: 'flex', flexDirection: 'row', padding: 8}}>
        <TouchableOpacity
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={t('Accessibility.EnterMeal.addTag')}
          style={{...styles.openButton}}
          onPress={() => setVisible(true)}>
          <Text style={{padding: 6, color: '#fff'}}>
            {t('AddMeal.tag.addTag')}
          </Text>
        </TouchableOpacity>
        <ScrollView horizontal={true}>
          {props.tags &&
            props.tags
              .filter(data => data.active === true)
              .map((tags, i) => {
                return (
                  <TouchableOpacity
                    key={i}
                    style={{...styles.openButton, backgroundColor: '#d7d4a3'}}
                    onPress={() => props.removeTag(tags.id)}>
                    <Text style={{fontSize: 14}}>{tags.name}</Text>
                  </TouchableOpacity>
                );
              })}
        </ScrollView>
      </View>

      <View style={styles.centeredView}>
        <Modal
          animationIn="slideInUp"
          animationOut="slideOutDown"
          isVisible={visible}
          backdropOpacity={0.3}
          onBackdropPress={() => setVisible(false)}
          onSwipeComplete={() => setVisible(false)}
          swipeDirection={['down']}
          onAccessibilityEscape={() => setVisible(false)}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={{...styles.modalText, fontWeight: 'bold'}}>
                {t('AddMeal.tag.addATag')}
              </Text>
              <Text style={styles.modalText}>{t('AddMeal.tag.findTag')}</Text>
              <SearchBar
                platform={Platform.OS}
                placeholder={t('AddMeal.tag.exampleTag')}
                onChangeText={text => setTag(text)}
                value={tag}
                onBlur={() => add()}
              />
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  paddingBottom: 12,
                }}>
                {exampleTags.map((data, i) => (
                  <TouchableOpacity key={i} onPress={() => setTag(data.tag)}>
                    <Text
                      style={
                        data.type === 'text'
                          ? {
                              fontSize: 16,
                              padding: 6,
                            }
                          : {fontSize: 25, padding: 6}
                      }>
                      {data.tag}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableOpacity
                  accessibilityRole="button"
                  style={{
                    ...styles.openButton,
                    backgroundColor: '#ffffff',
                    color: '#000',
                    minWidth: 100,
                  }}
                  onPress={() => setVisible(false)}>
                  <Text style={styles.textStyle}>{t('General.close')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  accessibilityRole="button"
                  style={{
                    ...styles.openButton,
                    backgroundColor: '#ffe109',
                    color: '#000',
                    minWidth: 100,
                  }}
                  onPress={() => add()}>
                  <Text style={styles.textStyle}>{t('General.Save')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};

const useStyles = makeStyles(theme => ({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
  },
  modalView: {
    margin: 10,
    backgroundColor: theme.colors.background,
    borderRadius: 20,
    padding: 15,
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.white,
    borderRadius: 25,
    padding: 6,
    paddingHorizontal: 12,
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  textStyle: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
  },
}));

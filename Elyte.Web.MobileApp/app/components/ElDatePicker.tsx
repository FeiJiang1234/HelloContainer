import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Pressable, Platform, Button, Modal } from 'react-native';
import ElInput from './ElInput';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import ElIcon from './ElIcon';
import { useDateTime } from '../utils';

type PropType = {
    name: string;
    onSelectedDate: any;
    placeholder: string;
    disabled?: boolean;
    defaultValue?: any;
    mode?: 'date' | 'datetime' | 'time' | undefined;
    [rest: string]: any;
};

const ElDatePicker: React.FC<PropType> = ({
    defaultValue,
    onSelectedDate,
    mode = 'date',
    ...rest
}) => {
    const { disabled } = rest;
    const initMode = mode === 'datetime' ? 'date' : mode;
    const { format, utcToLocalDatetime } = useDateTime();
    const [modalVisible, setModalVisible] = useState(false);
    const [date, setDate] = useState<Date>(defaultValue ? new Date(defaultValue) : new Date());
    const [pickerMode, setPickerMode] = useState<any>(initMode);
    const [tempDate, setTempDate] = useState<Date>(date);
    const [isMove, setIsMove] = useState(false);

    useEffect(() => {
        setTempDate(date);
    }, [date]);

    const handleDateChange = (event, newDate) => setTempDate(newDate);

    const handleSave = () => {
        if (mode === 'datetime' && pickerMode === 'date') {
            setPickerMode('time');
            return;
        }

        setPickerMode(initMode);
        setDate(tempDate);
        onSelectedDate(format(tempDate, 'MM/DD/YYYY HH:mm'));
        setModalVisible(false);
    };

    const handleCancel = () => {
        setTempDate(date);
        setPickerMode(initMode);
        setModalVisible(false);
    };

    const onAndroidDateChange = (event, newDate) => {
        if (event.type === 'dismissed') return;

        if (mode === 'datetime') {
            DateTimePickerAndroid.open({
                value: newDate,
                onChange: (e, dateForTime) => onAndroidTimeChange(e, dateForTime),
                mode: 'time',
            });
        } else {
            handleAndroidSave(newDate);
        }
    };

    const onAndroidTimeChange = (event, newDate) => {
        if (event.type === 'dismissed') return;

        handleAndroidSave(newDate);
    };

    const handleAndroidSave = newDate => {
        setDate(newDate);
        onSelectedDate(utcToLocalDatetime(newDate, 'MM/DD/YYYY HH:mm'));
        setModalVisible(false);
    };

    const handleShowPicker = () => {
        if (disabled) return;

        Platform.OS === 'ios'
            ? setModalVisible(true)
            : DateTimePickerAndroid.open({
                value: date,
                onChange: (event, newDate) => onAndroidDateChange(event, newDate),
                mode: initMode,
            });
    };

    const getFormat = () => {
        if (mode === 'datetime') return 'MM/DD/YYYY HH:mm';
        if (mode === 'time') return 'HH:mm';

        return 'MM/DD/YYYY';
    };

    const formatDateTime = () => defaultValue ? format(date, getFormat()) : '';

    return (
        <>
            <Pressable onPress={handleShowPicker}>
                <ElInput
                    editable={false}
                    defaultValue={formatDateTime()}
                    onPressIn={() => setIsMove(false)}
                    onTouchMove={() => setIsMove(true)}
                    onPressOut={() => {
                        if (disabled || isMove) return;

                        setModalVisible(true);
                    }}
                    {...rest}
                />
                <ElIcon name="calendar" style={styles.calendar} />
            </Pressable>

            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.container}>
                    <View style={styles.action}>
                        <Button title="Cancel" onPress={handleCancel} />
                        <Button title="Save" onPress={handleSave} />
                    </View>
                    <DateTimePicker
                        value={tempDate}
                        mode={pickerMode}
                        display="spinner"
                        onChange={handleDateChange}
                    />
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    calendar: {
        position: 'absolute',
        top: '35%',
        right: 10,
    },
    container: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        width: '100%',
    },
    action: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
export default ElDatePicker;

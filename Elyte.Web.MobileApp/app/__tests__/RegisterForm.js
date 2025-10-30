import { fireEvent, waitFor } from '@testing-library/react-native';
import RegisterForm from '../screen/register/components/RegisterForm';
import dictionaryService from '../api/dictionaryService';
import { NavigationContainer } from '@react-navigation/native';
import { render } from '@testing-library/react-native';
import { NativeBaseProvider } from 'native-base';

const renderRoot = ui => {
    const inset = {
        frame: { x: 0, y: 0, width: 0, height: 0 },
        insets: { top: 0, left: 0, right: 0, bottom: 0 },
    };
    return render(
        <NativeBaseProvider initialWindowMetrics={inset}>
            <NavigationContainer>{ui}</NavigationContainer>
        </NativeBaseProvider>,
    );
};

jest.mock('../api/dictionaryService');

const mockContry = {
    value: [{ label: 'United States', value: 100000000 }],
    code: 200,
    message: null,
    errors: null,
};

test('test register validate required', async () => {
    // Arrange
    const handleSubmit = jest.fn();
    dictionaryService.getCountries.mockReturnValue(mockContry);

    const { getByText } = renderRoot(<RegisterForm onSubmit={handleSubmit} />);

    // Act
    fireEvent.press(getByText('Create an account'));

    // Assert
    await waitFor(() => {
        expect(getByText('First Name is a required field'));
        expect(getByText('Last Name is a required field'));
        expect(getByText('Email is a required field'));
        expect(getByText('Phone Number is a required field'));
        expect(
            getByText(
                'Password length betweent 8 and 18, include alphanumeric and start with letter',
            ),
        );
        expect(getByText('Country is a required field'));
        expect(getByText('State is a required field'));
        expect(getByText('City is a required field'));
    });
});

test('test register validate password confirm', async () => {
    // Arrange
    const fakeUser = {
        firstName: 'fred',
        lastName: 'jiang',
        email: 'fred@elyte.com',
        phoneNumber: '17792387996',
        password: 'aa123456',
        confirmationPassword: 'aa1234567',
        country: '100000000',
        state: '100000001',
        city: '100000002',
    };

    const handleSubmit = jest.fn();
    dictionaryService.getCountries.mockReturnValue(mockContry);

    const { getByText, getByTestId } = renderRoot(<RegisterForm onSubmit={handleSubmit} />);

    // Act
    fireEvent.changeText(getByTestId('firstName'), fakeUser.firstName);
    fireEvent.changeText(getByTestId('lastName'), fakeUser.lastName);
    fireEvent.changeText(getByTestId('email'), fakeUser.email);
    fireEvent.changeText(getByTestId('phoneNumber'), fakeUser.phoneNumber);
    fireEvent.changeText(getByTestId('password'), fakeUser.password);
    fireEvent.changeText(getByTestId('confirmationPassword'), fakeUser.confirmationPassword);
    fireEvent.changeText(getByTestId('country'), fakeUser.country);
    fireEvent.changeText(getByTestId('state'), fakeUser.state);
    fireEvent.changeText(getByTestId('city'), fakeUser.city);
    fireEvent.press(getByText('Create an account'));

    // Assert
    await waitFor(() => {
        expect(getByText('The two passwords you entered did not match'));
    });
});

test('test register call submit with user data ', async () => {
    // Arrange
    const fakeUser = {
        firstName: 'fred',
        lastName: 'jiang',
        gender: 'male',
        email: 'fred@elyte.com',
        phoneNumber: '17792387996',
        password: 'aa123456',
        confirmationPassword: 'aa123456',
        birthday: new Date(1989, 3, 5),
        country: '100000000',
        state: '100000001',
        city: '100000002',
    };

    const handleSubmit = jest.fn();
    dictionaryService.getCountries.mockReturnValue(mockContry);

    const { getByText, getByTestId } = renderRoot(<RegisterForm onSubmit={handleSubmit} />);

    // Act
    fireEvent.changeText(getByTestId('firstName'), fakeUser.firstName);
    fireEvent.changeText(getByTestId('lastName'), fakeUser.lastName);
    fireEvent.changeText(getByTestId('email'), fakeUser.email);
    fireEvent.changeText(getByTestId('phoneNumber'), fakeUser.phoneNumber);
    fireEvent.changeText(getByTestId('password'), fakeUser.password);
    fireEvent.changeText(getByTestId('confirmationPassword'), fakeUser.confirmationPassword);
    fireEvent.changeText(getByTestId('country'), fakeUser.country);
    fireEvent.changeText(getByTestId('state'), fakeUser.state);
    fireEvent.changeText(getByTestId('city'), fakeUser.city);
    fireEvent.changeText(getByTestId('birthday'), fakeUser.birthday);
    fireEvent.press(getByText('Create an account'));

    // Assert
    await waitFor(() => {});
});

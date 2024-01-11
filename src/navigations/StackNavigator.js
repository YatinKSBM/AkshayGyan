import { View, Text } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from '../screens/Splash';
import Login from '../screens/Login';
import CustomerLogin from '../screens/CustomerLogin';
import ProviderLogin from '../screens/ProviderLogin';
import Signup from '../screens/Signup';
import DrawerNavigator from './DrawerNavigator';
import ForgetPassword from '../screens/provider/ForgetPassword';
import ProviderHome from '../screens/provider/ProviderHome';
import OrderHistory from '../screens/provider/OrderHistory';
import ProviderChat from '../screens/provider/ProviderChat';
import ChatRequest from '../screens/provider/ChatRequest';
import Logout from '../screens/Logout';
import AstrologerLogin from '../screens/provider/AstrologerLogin';
import Otp from '../screens/customer/Otp';
import AstrologerLIst from './AstrologerLIst';
import AstrologerDetailes from '../screens/customer/AstrologerDetailes';
import AllRemedies from '../screens/customer/AllRemedies';
import Wallet from '../screens/customer/Wallet';
import BillHistory from '../screens/customer/BillHistory';
import CustomerOrderHistory from '../screens/customer/CustomerOrderHistory';
import Following from '../screens/customer/Following';
import HowUse from '../screens/customer/HowUse';
import AskAstrologer from '../screens/customer/AskAstrologer';
import Testimonials from '../screens/customer/Testimonials';
import HelpSupport from '../screens/customer/HelpSupport';
import Setting from '../screens/customer/Setting';
import Kundli from './Kundli';
import Matching from './Matching';
import SelectSign from '../screens/customer/SelectSign';
import TotalCard from './TotalCard';
import ChatIntakeForm from '../screens/customer/ChatIntakeForm';
import PlaceOfBirth from '../screens/customer/PlaceOfBirth';
import ChatPickup from '../screens/customer/ChatPickup';
import CustomerChat from '../screens/customer/CustomerChat';
import CallIntakeForm from '../screens/customer/CallIntakeForm';
import {
  ZegoUIKitPrebuiltCallWaitingScreen,
  ZegoUIKitPrebuiltCallInCallScreen,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import ChatRating from '../screens/customer/ChatRating';
import ChatInvoice from '../screens/customer/ChatInvoice';
import AstroDateRegister from '../screens/customer/AstroDateRegister';
import AstroAccount from '../screens/customer/AstroAccount';
import ChoosePlan from '../screens/customer/ChoosePlan';
import ConnectWithFriends from './ConnectWithFriends';
import ShowKundli from '../screens/customer/ShowKundli';
import KundliMatch from '../screens/customer/KundliMatch';
import ShowHoroscope from '../screens/customer/ShowHoroscope';
import TarotCard from '../screens/customer/TarotCard';
import OneCardReading from '../screens/customer/OneCardReading';
import CustomerAccount from '../screens/customer/CustomerAccount';
import UserGuide from '../screens/customer/UserGuide';
import BlogDetailes from '../screens/customer/BlogDetailes';
import RecommendedProfile from '../screens/customer/RecommendedProfile';
import CallInvoice from '../screens/customer/CallInvoice';
import Notifications from '../screens/customer/Notifications';
import NotificationDetailes from '../screens/customer/NotificationDetailes';
import VerifiedAstrologer from '../screens/provider/VerifiedAstrologer';
import ProviderRemedies from './ProviderRemedies';
import AstrologerWallet from '../screens/provider/AstrologerWallet';
import ProviderFollowing from '../screens/provider/ProviderFollowing';
import ProviderOffer from '../screens/provider/ProviderOffer';
import ProviderProfile from '../screens/provider/ProviderProfile';
import ProviderChatPickup from '../screens/provider/ProviderChatPickup';
import AstrodateChat from '../screens/customer/AstrodateChat';
import AstroForChat from '../screens/customer/AstroForChat';
import CusHome from '../screens/customer/Home';
import Book_puja from '../screens/customer/Book_puja';
import AudiencePage from '../screens/customer/AudiencePage';
import HostPage from '../screens/provider/HostPage';
import HomePage from '../screens/HomePage';
// import ApplyForLive from '../screens/provider/CreatRequest';
import TopNavigation from './TopNavigation';
import CreatRequest from '../screens/provider/CreatRequest';
import LiveList from '../screens/provider/LiveList';
import ProductDetails from '../screens/customer/ProductDetails';
import ReferAndEarn from '../screens/customer/ReferAndEarn';

const Stack = createNativeStackNavigator();
const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="splash">
      <Stack.Screen name="splash" component={Splash} />
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="customerLogin" component={CustomerLogin} />
      <Stack.Screen name="providerLogin" component={ProviderLogin} />
      <Stack.Screen name="signup" component={Signup} />

      <Stack.Screen
        name="home"
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="forgetPassword" component={ForgetPassword} />
      <Stack.Screen name="providerHome" component={ProviderHome} />
      <Stack.Screen name="orderHistory" component={OrderHistory} />
      <Stack.Screen name="providerChat" component={ProviderChat} />
      <Stack.Screen name="chatRequest" component={ChatRequest} />
      <Stack.Screen name="logout" component={Logout} />
      <Stack.Screen name="astrologerLogin" component={AstrologerLogin} />
      <Stack.Screen name="otp" component={Otp} />
      <Stack.Screen name="astrologerList" component={AstrologerLIst} />
      <Stack.Screen name="astrologerDetailes" component={AstrologerDetailes} />
      <Stack.Screen name="productDetails" component={ProductDetails} />
      <Stack.Screen name="allRemedies" component={AllRemedies} />
      <Stack.Screen name="wallet" component={Wallet} />
      <Stack.Screen name="billHistory" component={BillHistory} />
      <Stack.Screen
        name="customerOrderHistory"
        component={CustomerOrderHistory}
      />
      <Stack.Screen name="following" component={Following} />
      <Stack.Screen name="howUse" component={HowUse} />
      <Stack.Screen name="askAstrologer" component={AskAstrologer} />
      <Stack.Screen name="testimonials" component={Testimonials} />
      <Stack.Screen name="helpSupport" component={HelpSupport} />
      <Stack.Screen name="setting" component={Setting} />
      <Stack.Screen name="kundli" component={Kundli} />
      <Stack.Screen name="matching" component={Matching} />
      <Stack.Screen name="selectSign" component={SelectSign} />
      <Stack.Screen name="totalCard" component={TotalCard} />
      <Stack.Screen name="chatIntakeForm" component={ChatIntakeForm} options={{ keyboardHandlingEnabled: false }} />
      <Stack.Screen name="placeOfBirth" component={PlaceOfBirth} />
      <Stack.Screen name="chatPickup" component={ChatPickup} />
      <Stack.Screen name="customerChat" component={CustomerChat} options={{ gestureEnabled: false }} />
      <Stack.Screen name="callIntakeForm" component={CallIntakeForm} />
      <Stack.Screen
        name="ZegoUIKitPrebuiltCallInCallScreen"
        component={ZegoUIKitPrebuiltCallInCallScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ZegoUIKitPrebuiltCallWaitingScreen"
        component={ZegoUIKitPrebuiltCallWaitingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name='chatRating' component={ChatRating} />
      <Stack.Screen name='chatInvoice' component={ChatInvoice} options={{ animation: 'fade', headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name='astroDateRegister' component={AstroDateRegister} />
      <Stack.Screen name='astroAccount' component={AstroAccount} />
      <Stack.Screen name='choosePlan' component={ChoosePlan} />
      <Stack.Screen name='connectWithFriends' component={ConnectWithFriends} />
      <Stack.Screen name='showKundli' component={ShowKundli} />
      <Stack.Screen name='kundliMatch' component={KundliMatch} />
      <Stack.Screen name='showHoroscope' component={ShowHoroscope} />
      <Stack.Screen name='tarotCard' component={TarotCard} />
      <Stack.Screen name='oneCardReading' component={OneCardReading} />
      <Stack.Screen name='customerAccount' component={CustomerAccount} />
      <Stack.Screen name='userGuide' component={UserGuide} />
      <Stack.Screen name='blogDetailes' component={BlogDetailes} />
      <Stack.Screen name='recommendedProfile' component={RecommendedProfile} />
      <Stack.Screen name='callInvoice' component={CallInvoice} />
      <Stack.Screen name='notificationDetailes' component={NotificationDetailes} />
      <Stack.Screen name='astrodateChat' component={AstrodateChat} />
      <Stack.Screen name='referAndEarn' component={ReferAndEarn} />
      <Stack.Screen name='notifications' component={Notifications} />

      {/* //Prvider  */}
      <Stack.Screen name='verifiedAstrologer' component={VerifiedAstrologer} />
      <Stack.Screen name='providerRemedies' component={ProviderRemedies} />
      <Stack.Screen name='astrologerWallet' component={AstrologerWallet} />
      <Stack.Screen name='providerFollowing' component={ProviderFollowing} />
      <Stack.Screen name='providerOffer' component={ProviderOffer} />
      <Stack.Screen name='providerProfile' component={ProviderProfile} />
      <Stack.Screen name='providerChatPickup' component={ProviderChatPickup} />
      <Stack.Screen name='AstroForChat' component={AstroForChat} />
      <Stack.Screen name='Home' component={CusHome} />
      <Stack.Screen name='Book_puja' component={Book_puja} />
      <Stack.Screen name='AudiencePage' component={AudiencePage} />
      <Stack.Screen name='HostPage' component={HostPage} options={{ headerShown: false }} />
      <Stack.Screen name='HomePage' component={HomePage} />
      <Stack.Screen name='CreatRequest' component={CreatRequest} options={{ headerShown: false }} />
      <Stack.Screen name='ApplyForLive' component={TopNavigation} options={{ headerShown: false }} />
      <Stack.Screen name='LiveList' component={LiveList} options={{ headerShown: false }} />



    </Stack.Navigator>
  );
};

export default StackNavigator;

// vDyrZdnqcvTtYK8F9BlDDDFWTaF2

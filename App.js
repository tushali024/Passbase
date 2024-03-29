import React from 'react';
import { NativeEventEmitter, Platform, View, StyleSheet, TouchableOpacity, Text, Alert, ActivityIndicator } from 'react-native';
import { PassbaseModule, PassbaseButton } from '@passbase/react-native-passbase';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initSucceed: false,
      loading: false
    };
  }
  async componentDidMount() {
    this.subscription = new NativeEventEmitter(PassbaseModule);
    this.subscription.addListener('onCancelPassbase', (event) => {
      console.log("##onCancelPassbase##", event)
    })
    this.subscription.addListener('onCompletePassbase', (event) => {
      console.log("##onCompletePassbase##", event)
    })
  }

  handlePassbaseClick = async () => {
    const { initSucceed, loading } = this.state
    if (loading) {
      return
    }
    this.setState({ loading: true }, async () => {
      if (initSucceed) {
        // Promise based method call
        const res = await PassbaseModule.startVerification();
        this.setState({ loading: false })
        if (!res.success) {
          alert('something went wrong. while starting verification.')
        }

        //Callback based call
        // PassbaseModule.startVerification((res) => {
        //     if (res && res.success) {
        //         this.setState({loading: false})
        //     }
        //     console.log('StartVerification: ', res)
        // }, (err) => {
        //     console.log('errorStartVerification: ', err)
        // })
      } else {
        // promise based implementation
        const res = await PassbaseModule.init(
          '4a53a6552eb0ecfb536808beb2541515d93898e64af858b72ed87477519ea046',
          '', // EMAIL HERE OR EMPTY STRING.
          {}
        )
        console.log("initRes: ", res)
        if (res && res.success) {
          PassbaseModule.setLoadingIndicatorColor('#A49E8D')
          PassbaseModule.setActionButtonBgColor('#504136')
          PassbaseModule.setActionButtonDeactivatedBgColor('#d2d2d2')
          PassbaseModule.setActionButtonTextColor('#ffffff')
          PassbaseModule.setDisclaimerTextColor('#800000')
          PassbaseModule.setTitleTextColor('#008080')
          PassbaseModule.setSubtitleTextColor('#B2E6D4')
          this.setState({ initSucceed: true, loading: false })
        }

        //Callback based implementation
        // PassbaseModule.init(
        //     'YOUR_PUBLISHABLE_API_KEY',
        //     '', // EMAIL HERE OR EMPTY STRING.
        //     {},
        //     (res) => {
        //         console.log('***onSuccess:*** ', res)
        //         if (res.success) {
        //             if (res && res.success) {
        //                 this.setState({initSucceed: true, loading: false})
        //             }
        //         }
        //     },
        //     (err) => {
        //         this.setState({loading: false})
        //         console.log('onFailure: ', err)
        //     }
        // )
      }
    })
  }

  render() {
    const { initSucceed, loading } = this.state;
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.button}
          onPress={this.handlePassbaseClick}>
          <Text style={styles.btnText}>
            {initSucceed ? 'start verification' : 'initialize SDK'}
          </Text>
          {
            loading && <View style={styles.loadingContainer}>
              <ActivityIndicator size={'large'} />
            </View>
          }
        </TouchableOpacity>
        {
          initSucceed && <PassbaseButton style={{ margin: 10, backgroundColor: 'white' }} />
        }
      </View>
    );
  }

  componentWillUnmount() {
    if (this.subscription)
      this.subscription.removeListener('onCompletePassbase', (event) => {
        console.log("##removing listener didCompletePassbaseVerification##", event)
      })
    this.subscription.removeListener('onCancelPassbase', (event) => {
      console.log("##removing listener didCancelPassbaseVerification##", event)
    })

  }
}
export default App;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    width: 250,
    padding: 10,
    margin: 10,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold'
  },
  component: {
    width: 100,
    height: 100,
    margin: 5
  },
  loadingContainer: {
    position: 'absolute',
    left: 0, right: 0, top: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
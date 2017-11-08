exports.messages = {
  unsupportedEmail: 'Email address is not supported. Please use a <strong>$</strong> email.',
  partialVerify: 'It seems you haven\'t verifed your account yet. Please check your email.',
  logoutSuccess: 'You have logged out successfully',
  pleaseVerify: 'We\'ve sent a verification email to <strong>$</strong>. <br/> <br/>Please verify your account.',
  sessionExpiry: 'You\'re session has expired. Please log in to continue.',
  pleaseLogin: 'Please log in to access this page',
  profileUpdated: 'Your profile has been updated'
};

exports.getMessage = (name, data) => {
  console.log(data);
  if ( data && data.length > 0 ) {
    var message = exports.messages[name];
    if ( message.indexOf('$') != -1 ) {
      message = message.replace('$', data[0]);
      return message;
    }
  }
  return exports.messages[name]
}

exports.setMessage = (name, message) => {
  exports.messages[name] = message;
  
}

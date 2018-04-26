(function () {
  function err (msg) {
    typeof console !== 'undefined' && console.error(`[g-signin-button] ${msg}`)
  }
	var config = null
	var GoogleAuth
  var defaultConfig = { scope: 'profile email https://www.googleapis.com/auth/plus.login', discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'], }
  var directAccess = false
  var gapiUrl = 'https://apis.google.com/js/api.js'

  var gAuth = {
    install: function (Vue, options) {
			//set config
      if (typeof options === 'object') {
				config = Object.assign(defaultConfig, options)
				if(!options.clientId) {
					console.warn('clientId is required')
				}
			}else{
				console.warn('invalid option type. Object type accepted only')
			}
			
			//Install Vue plugin
			Vue.googleAuth = googleAuth
      Vue.prototype.$googleAuth = googleAuth
    }
  }

  function googleAuth () {
    return {
      load: function () {
        installClient().then(function () {
					initClient()
				})
      },

      directAccess: function () {
        directAccess = true
      },

      signIn: function (successCallback, errorCallback) {
        if (directAccess) {
          GoogleAuth.signIn().then(function (googleUser) {
            successCallback(googleUser)
          }, function (error) {
            errorCallback(error)
          })
        } else {
					GoogleAuth.grantOfflineAccess({prompt: 'consent'})
					.then(function(resp) {
						successCallback(resp.code)
					})
					.catch((error) => {
						errorCallback(error)
					})
        }
      },

      signOut: function (successCallback, errorCallback) {
        GoogleAuth.signOut().then(function () {
          successCallback()
        }, function (error) {
          errorCallback(error)
        })
      }
    }
  }

  function installClient () {
		return new Promise(function (resolve, reject) {
			var script = document.createElement('script')
			script.src = gapiUrl
			script.onreadystatechange = script.onload = function () {
				if (!script.readyState || /loaded|compvare/.test(script.readyState)) {
					setTimeout(function () {
						resolve()
					}, 500)
				}
			}
			document.getElementsByTagName('head')[0].appendChild(script)
		})
	}
	
	function initClient () {
		window.gapi.auth2.init(config)
		.then(function () {
			GoogleAuth = gapi.auth2.getAuthInstance()
		})
	}

  if (typeof exports === 'object') {
    module.exports = gAuth.install
  } else if (typeof define === 'function' && define.amd) {
    /*global define*/
    define([], function () { return gAuth.install })
  }
})()

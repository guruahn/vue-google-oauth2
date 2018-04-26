;(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory)
  } else if (typeof exports === 'object') {
    module.exports = factory()
  } else {
    global.Index = factory()
  }
}(this, function () {
  let config = null
  let defaultConfig = { scope: 'profile email https://www.googleapis.com/auth/plus.login', discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'], }
  var directAccess = false
  var gapiUrl = 'https://apis.google.com/js/api.js'

  var gAuth = {
    install: function (Vue, options) {
			//set config
      if (typeof options === 'object') {
        config = Object.assign(defaultConfig, options)
			}else{
				console.warn('')
			}
			
			//Install Vue plugin
			Vue.gAuth = googleAuth
			Object.defineProperties(Vue.prototype, {
				$gAuth: {
					get: function () {
						return Vue.gAuth
					}
				}
			})
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
          window.gapi.auth2.getAuthInstance().signIn().then(function (googleUser) {
            successCallback(googleUser)
          }, function (error) {
            errorCallback(error)
          })
        } else {
          window.gapi.auth2.getAuthInstance().grantOfflineAccess({'redirect_uri': 'postmessage'}).then(function (response) {
            successCallback(response.code)
          }, function (error) {
            errorCallback(error)
          })
        }
      },

      signOut: function (successCallback, errorCallback) {
        window.gapi.auth2.getAuthInstance().signOut().then(function () {
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
				if (!script.readyState || /loaded|complete/.test(script.readyState)) {
					setTimeout(function () {
						resolve()
					}, 500)
				}
			}
			document.getElementsByTagName('head')[0].appendChild(script)
		})
	}

  function initClient () {
    return new Promise(function (resolve, reject) {
      window.gapi.load('auth2', function () {
        window.gapi.auth2.init(config)
        resolve()
      })
    })
	}
	
	function initClient () {
		window.gapi.auth2.init(config)
		.then(function () {
			console.log('then initClient')
				GoogleAuth = gapi.auth2.getAuthInstance()
		})
	}

  return gAuth
}))

package com.jianshi.tools;

  import android.util.Log;
  import android.webkit.CookieManager;
  import android.webkit.CookieSyncManager;
  import org.apache.cordova.CallbackContext;
  import org.apache.cordova.CordovaPlugin;
  import org.json.JSONArray;
  import org.json.JSONException;
  import org.json.JSONObject;

  import java.util.HashMap;

  import cn.sharesdk.framework.Platform;
  import cn.sharesdk.framework.PlatformActionListener;
  import cn.sharesdk.framework.ShareSDK;
  import cn.sharesdk.wechat.friends.Wechat;


public class GetAjaxRequest extends CordovaPlugin{
  @Override
  public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
    if ("setCookie".equals(action)){
      String[] cookies = args.getString(0).split(";");
      CookieManager cookieManager = CookieManager.getInstance();
      cookieManager.setAcceptCookie(true);
      for(int i = 0; i < cookies.length; i++) {
        cookieManager.setCookie(args.getString(1), cookies[i]);
      }
      if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
        cookieManager.flush();
      } else {
        CookieSyncManager.createInstance(this.cordova.getActivity());
        CookieSyncManager.getInstance().sync();
      }
      callbackContext.success();
    }else if (action.equals("login"))
    {
      login(callbackContext);
    }else
      return false;
    return true;
  }

  private void login(final CallbackContext paramCallbackContext)
  {
    Platform localPlatform = null;
    localPlatform = ShareSDK.getPlatform(Wechat.NAME);
    localPlatform.SSOSetting(false);
    localPlatform.setPlatformActionListener(new PlatformActionListener() {

      @Override
      public void onComplete(Platform platform, int i, HashMap<String, Object> hashMap) {
        paramCallbackContext.success(new JSONObject(hashMap));
      }

      @Override
      public void onError(Platform arg0, int arg1, Throwable arg2) {
        // TODO Auto-generated method stub
        try {
          paramCallbackContext.error(new JSONObject(arg2.getMessage()));
        }catch (JSONException e) {
          e.printStackTrace();
        }
      }


      @Override
      public void onCancel(Platform arg0, int arg1) {
        // TODO Auto-generated method stub

      }
    });
    localPlatform.showUser(null);
  }
}

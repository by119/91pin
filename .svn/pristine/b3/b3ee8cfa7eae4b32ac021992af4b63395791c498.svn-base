#import <Cordova/CDVPlugin.h>
#import "MyUrlCache.h"

@interface GetAjaxRequest : CDVPlugin
{

}

@property(retain, nonatomic) MyUrlCache *cache;
@property(retain, nonatomic) NSString *targetUrl;
@property(retain, nonatomic) CDVInvokedUrlCommand *tempCommand;

- (void)get:(CDVInvokedUrlCommand *)command;
- (void)clear:(CDVInvokedUrlCommand *)command;
- (void)setCookie:(CDVInvokedUrlCommand *)command;
- (void)login:(CDVInvokedUrlCommand *)command;
- (void)getNotification:(NSNotification *)notification;

@end

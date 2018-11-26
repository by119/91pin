#import "MyUrlCache.h"

@implementation MyUrlCache

- (void)storeCachedResponse:(NSCachedURLResponse *)cachedResponse forRequest:(NSURLRequest *)request {
    NSArray *msg = [[NSArray alloc] initWithObjects:request.URL.absoluteString, [[NSString alloc] initWithData:cachedResponse.data encoding:NSUTF8StringEncoding],nil];
    [[NSNotificationCenter defaultCenter] postNotification:[NSNotification notificationWithName:@"MyUrlCache" object:msg]];
}

@end

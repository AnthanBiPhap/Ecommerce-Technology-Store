import express, { NextFunction, Request, Response } from 'express';
import categoriesRouter from './routes/v1/categories.route';
import brandsRouter from './routes/v1/brands.route';
import productsRouter from './routes/v1/products.route';
import usersRouter from './routes/v1/users.route';
import authsRouter from './routes/v1/auths.route';
import uploadRouter from './routes/v1/upload.router';
import vendorRouter from './routes/v1/vendors.route';
import orderRouter from './routes/v1/orders.route';
import reviewRouter from './routes/v1/reviews.route';
import cartRouter from './routes/v1/carts.route';
import paymentRouter from './routes/v1/payments.route';
import wishlistRoute from './routes/v1/wishlists.route';
import couponRoute from './routes/v1/coupons.route';
import addressRoute from './routes/v1/addresses.route';
import shippingRoute from './routes/v1/shippings.route';
import notificationRoute from './routes/v1/notifications.route';
import productVariantRoute from './routes/v1/productVariants.route';
import locationRoute from './routes/v1/locations.route';
import productIventoryRoute from './routes/v1/productIventories.route';
import settingRoute from './routes/v1/settings.route';
import productAttributeRoute from './routes/v1/productAttributes.route';
import paymentMethodRoute from './routes/v1/paymentMethods.route';
import activityLogRoute from './routes/v1/activityLogs.route';
import seoRoute from './routes/v1/seos.route';
import techNewRoute from './routes/v1/techNews.route';


var compression = require('compression');
var cors = require('cors');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// compress all response
app.use(compression());




const string = 'xin chào!'


/**---------------|| BEGIN REGISTER ROUTES || ----------------- */

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send(string);
});
app.use('/api/v1', categoriesRouter);
app.use('/api/v1', brandsRouter);
app.use('/api/v1', productsRouter);
app.use('/api/v1', usersRouter);
app.use('/api/v1', vendorRouter);
app.use('/api/v1', orderRouter);
app.use('/api/v1', reviewRouter);
app.use('/api/v1', cartRouter);
app.use('/api/v1', paymentRouter);
app.use('/api/v1', wishlistRoute);
app.use('/api/v1', couponRoute);
app.use('/api/v1', addressRoute);
app.use('/api/v1', shippingRoute);
app.use('/api/v1', notificationRoute);
app.use('/api/v1', productVariantRoute);
app.use('/api/v1', locationRoute);
app.use('/api/v1', productIventoryRoute);
app.use('/api/v1', settingRoute);
app.use('/api/v1', productAttributeRoute);
app.use('/api/v1', paymentMethodRoute);
app.use('/api/v1', activityLogRoute);
app.use('/api/v1', seoRoute);
app.use('/api/v1', techNewRoute);


//login and get profile route
app.use('/api/v1/auth', authsRouter);
//upload images với multer middleware
app.use('/api/v1', uploadRouter);
app.use('/uploads', express.static('public/uploads'));



/**---------------|| BEGIN REGISTER ROUTES || ----------------- */

/** -----------------|| BEGIN HANDLE ERRORS || --------------* */
// catch 404 and forward to error handler
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
    const statusCode = err.status || 500;
    res.status(statusCode).json({ 
      statusCode: statusCode, 
      message: err.message
    });
  });
  
  /** -----------------|| END HANDLE ERRORS || --------------* */

  export default app;
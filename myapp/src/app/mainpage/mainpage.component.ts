import { Component, Inject,inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';  // Import RxJS 'of' to simulate the response
import { delay } from 'rxjs/operators';
import { IndexedDbService } from '../services/indexed-dbservice.service';
@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./mainpage.component.css'],
})
export class MainpageComponent {
  cities = ['New York', 'Los Angeles', 'Chicago'];
  restaurants = ['Pizza Place', 'Burger Joint', 'Vegan Delight'];
  dynamicRestaurants: string[] = []; 
  diets = ['Vegetarian', 'Vegan', 'Keto'];

  selectedCity = '';
  selectedRestaurant = '';
  selectedDiet = '';

  availableFood: any[] = [];
  selectedQuantities: number[] = [];
  totalPrice: number = 0;  

  foodOptions: any = {};
  orders: any[] = [];
  private db: IDBDatabase | null = null;
  IndexedDbService: any;

  constructor(private http: HttpClient,@Inject(PLATFORM_ID) private platformId: Object) {}
  indexedDbService = inject(IndexedDbService);
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      console.log('Running in the browser.');
      this.http.get('food-options.json').subscribe(data => {
        this.foodOptions = data;
      });
      this.retrieveOrders();
    } else {
      console.log('Running on the server.');
    }
  }

  onCityChange() {
    if (this.selectedCity && this.foodOptions[this.selectedCity]) {
      // Update restaurants dynamically based on the selected city
      this.dynamicRestaurants = Object.keys(this.foodOptions[this.selectedCity]);
      // Reset restaurant, diet, and available food on city change
      this.selectedRestaurant = '';
      this.selectedDiet = '';
      this.availableFood = [];
    }
  }

  // Update available food when restaurant or diet changes
  onSelectionChange() {
    if (this.selectedCity && this.foodOptions[this.selectedCity]) {
      const cityOptions = this.foodOptions[this.selectedCity];

      if (this.selectedRestaurant && cityOptions[this.selectedRestaurant]) {
        const restaurantOptions = cityOptions[this.selectedRestaurant];

        if (this.selectedDiet && restaurantOptions[this.selectedDiet]) {
          this.availableFood = restaurantOptions[this.selectedDiet];
          this.selectedQuantities = new Array(this.availableFood.length).fill(0); // Set default quantity to 1 for each item
          this.calculateTotalPrice();
        } else {
          this.availableFood = [];
        }
      } else {
        this.availableFood = [];
      }
    } else {
      this.availableFood = [];
    }
  }

  // Calculate total price based on selected quantities
  calculateTotalPrice() {
    this.totalPrice = this.availableFood.reduce((total, food, index) => {
      const quantity = this.selectedQuantities[index] || 0;
      return total + food.price * quantity;
    }, 0);
  }
  onPlaceOrder() {
    if (this.totalPrice > 0) {
      const orderDetails = this.availableFood.map((food, index) => ({
        name: food.name,
        quantity: this.selectedQuantities[index],
        price: food.price,
      })).filter(orderItem => orderItem.quantity > 0);

      const payload = {
        city: this.selectedCity,
        restaurant: this.selectedRestaurant,
        diet: this.selectedDiet,
        order: orderDetails,
        totalPrice: this.totalPrice,
      };
        // Save order to IndexedDB
        const timestamp = new Date().toISOString();
        const indexedDbPayload = {
          city: this.selectedCity,
          restaurant: this.selectedRestaurant,
          diet: this.selectedDiet,
          order: orderDetails,
          totalPrice: this.totalPrice,
          timestamp: timestamp
        };
        this.indexedDbService.saveOrder(indexedDbPayload).then(() => {
          console.log('Order saved to IndexedDB successfully.');
          console.log(indexedDbPayload);
        }).catch(err => {
          console.error('Error saving order to IndexedDB:', err);
        });
    // Send the data to the backend using HttpClient
    const apiBaseUrl = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api/user'
    : 'http://192.168.200.148:3000/api/user';
    //this.http.post(`${apiBaseUrl}/submitOrder`, payload).subscribe();
   // this.http.post('http://192.168.200.148:3000/api/user/submitOrder', payload).subscribe();
    this.http.post('http://localhost:3000/api/user/submitOrder', payload).subscribe();
    

    
 /*     const mockResponse = {
        message: 'Order placed successfully!',
        orderDetails: payload
      };

      // Using RxJS 'of' to simulate the asynchronous behavior
      of(mockResponse)
        .pipe(delay(1000))  // Adding delay to simulate network request
        .subscribe(
          (response) => {
            // Handle successful response
            console.log('Mock response:', response);
            alert(`Order placed successfully! Total: $${this.totalPrice}`);
          },
          (error) => {
            // Handle error response
            console.error('Error placing order:', error);
            alert('There was an error placing the order. Please try again.');
          }
        );*/
    }
    
  }
    // New method to retrieve orders
    retrieveOrders() {
      const apiBaseUrl = window.location.hostname === 'localhost'
        ? 'http://localhost:3000/api/user'
        : 'http://192.168.200.148:3000/api/user';
    
      this.http.get('http://localhost:3000/api/user/getOrders')
        .subscribe((data: any) => {
            this.orders = data; // Store the orders
            console.log('Orders retrieved:', this.orders);
            
            // Check if orders were retrieved, then trigger notification
            if (this.orders && this.orders.length > 0) {
              this.sendPushNotification({
                title: 'New Orders',
                body: `${this.orders.length} new orders have been retrieved.`,
              });
            }
          },
          (error) => {
            console.error('Error retrieving orders:', error);
          }
        );
    }
    
    sendPushNotification(notificationData: { title: string, body: string }) {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        navigator.serviceWorker.ready.then(registration => {
          registration.showNotification(notificationData.title, {
            body: notificationData.body,
          });
        });
      }
    }
    
    // Method to remove an order from the order history
removeOrder(index: number) {
  this.orders.splice(index, 1);
  console.log('Order removed from UI.');
}

}

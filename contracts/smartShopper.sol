// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract SmartShopper {

    address owner;
    uint numOfOrders;
    uint _orderID;

    struct Seller {
        string shopName;
        string sellerName;
        address addr;
        bool isActive;
    }

    struct Product {
        string productID;
        string productName;
        uint price;
        bool inStock;
        address payable sellerAddr;
    }

    struct Order {
        uint orderID;
        string productID;
        address payable buyerAddr;
    }

    struct Buyer {
        string buyerName;
        string phoneNo;
        string shippingAddr;
        bool isActive;
    } 

    constructor() {
        owner = msg.sender;
    }
    
    mapping (address => Seller) sellers;
    mapping (string => Product) products;
    mapping (address => Buyer) buyers;
    mapping (uint => Order) orders;
    mapping (address=> Order[]) buyerOrderList;


    Seller[] public sellerList;
    Product[] public productList;
    Order[] public systemOrderList;

    function signUpAsSeller (string memory _shopName, string memory _sellerName) public {
        // require(msg.value == 0.0000005 ether);
        require(!sellers[msg.sender].isActive , "You have already signed up as seller.");
        
        sellers[msg.sender].shopName = _shopName;
        sellers[msg.sender].sellerName = _sellerName;
        sellers[msg.sender].addr = msg.sender;
        sellers[msg.sender].isActive = true;
    }

    function addProduct (string memory _productID, string memory _productName, uint _price) public {
        require(!products[_productID].inStock, "This product ID is already in stock.");
        require(sellers[msg.sender].isActive, "You must be registed as seller to add a product.");
        
        Product memory product = Product(_productID, _productName, _price, true, payable(msg.sender));
        products[_productID].productID = _productID;
        products[_productID].productName = _productName;
        products[_productID].price = _price;
        products[_productID].inStock = true;
        products[_productID].sellerAddr = payable(msg.sender);
        
        productList.push(product);
    }

    function signUpAsBuyer (string memory _buyerName, string memory _phoneNo, string memory _shippingAddr) public {
        require(!buyers[msg.sender].isActive, "You have already signed up as buyer.");
        require(!sellers[msg.sender].isActive, "Buyers cannot sign up as buyer.");
        buyers[msg.sender].buyerName = _buyerName;
        buyers[msg.sender].phoneNo = _phoneNo;
        buyers[msg.sender].shippingAddr = _shippingAddr;
        buyers[msg.sender].isActive = true;
    }


    function getSellerListLength () public view returns (uint) {
        return sellerList.length;
    }

    function getProductListLength () public view returns (uint) {
        return productList.length;
    }

    function orderProduct (string memory _productID) public payable {
        //require(!sellers[msg.sender].isActive, "Buyers cannot sign up as buyer.");
        require (buyers[msg.sender].isActive, "Sorry, you must be registered as buyer to make an order.");
        
        // check if product is in stock ?
        // bool isInStock = false;
        // for (uint i=0; i < productList.length; i++) {
        //     string memory productID = productList[i].productID;
        //     if (keccak256(abi.encodePacked(productID)) == keccak256(abi.encodePacked(_productID))) {
        //         if (productList[i].inStock) {
        //             isInStock = true;
        //         }
        //     }
        // }
        // require(isInStock == true, "Sorry, this product is not available at the moment.");
        
        require(msg.value == products[_productID].price);
        address payable shopAddress = payable(products[_productID].sellerAddr);
        (shopAddress).transfer(msg.value); //sellerAddress = receiver address

        _orderID = numOfOrders++;
        Order memory order = Order(_orderID, _productID, payable(msg.sender));
        orders[_orderID].orderID = _orderID;
        orders[_orderID].productID = _productID;
        orders[_orderID].buyerAddr = payable(msg.sender);

        systemOrderList.push(order);
        //buyerOrderList[payable(msg.sender)].push(order);
    }

    function transferTest(uint price) public payable {
        address payable myAddress = payable(0xD3Fa226f8Fe593e559428D2173cd05c58f524598);
        (myAddress).transfer(price); 
    }

    function getSystemOrderLength() public view returns(uint){
        return(systemOrderList.length);
    }

    // function seeOrders () public view returns (Order[] memory) {
    //     return (orders[msg.sender]);
    // }

    function deposit() public payable {
        
    }
}
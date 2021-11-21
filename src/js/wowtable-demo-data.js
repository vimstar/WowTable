const CollectorGroups = [
    {GroupId: 101, GroupName: "AutoClub"},
    {GroupId: 201, GroupName: "The Toy Zone"},
    {GroupId: 202, GroupName: "Arcade Collectors"}
];

const AuctionInfo = [
    {
        "AuctionCode": "1001 - Storage Auctions",
        "AuctionDetail": `Storage Auctions Unlimited
• Auctions are held M - F from 8:00 AM to 5:00 PM
• Full aray of services available for storage auction`
    },
    {
        "AuctionCode": "1131 - Toy Auctions",
        "AuctionDetail": `Toy & Game Collectors Expo
• Auctions are held Tue, Thr, Fri, from 10:00 AM to 3:00 PM
• All toys from any eara are accepted`
    },
    {
        "AuctionCode": "2222 - Game Auctions",
        "AuctionDetail": `Arcade & Video Game Auctions Inc.
• Auctions are held once a week on Wednesdays. Auction times are 10AM, 12PM, 2PM, and 4PM.`
    },
    {
        "AuctionCode": "1020 - Collectable Auction",
        "AuctionDetail": `Nick Nacks and Stuff Collectors Auction
• Auction days and times vary. check website for available times and to register. The auction site web address is www.nandncollectors.com.`
    },
    {
        "AuctionCode": "4422 - Automotive Auction",
        "AuctionDetail": `Mecum Auto Auctions
• Times and dates vary. Check official schedule for coming auctions.
• Auction entry fee is $500 plus 6% commission on sales.
• All vehicles are accepted.`
    },
    {
        "AuctionCode": "3618 - Home Auction",
        "AuctionDetail": "Remax Home Auctions"
    }
];

const MemberStatus = [
    {
        StatusCode: 101,
        StatusDesc: "Basic Membership",
    },
    {
        StatusCode: 201,
        StatusDesc: "Bronze Membership",
    },
    {
        StatusCode: 202,
        StatusDesc: "Silver Membership",
    },
    {
        StatusCode: 203,
        StatusDesc: "Gold Membership",
    },
    {
        StatusCode: 204,
        StatusDesc: "Platinum Membership",
    },
    {
        StatusCode: 301,
        StatusDesc: "Special VIP Membership",
    }
];

const ItemType = [
    {
        CategoryId: 100,
        CategoryName: "Vehicles",
        SubCategoryId: 110,
        SubCategoryName: "Cars",
        Type: "Sports Car"
    },
    {
        CategoryId: 100,
        CategoryName: "Vehicles",
        SubCategoryId: 110,
        SubCategoryName: "Cars",
        Type: "Luxury"
    },
    {
        CategoryId: 100,
        CategoryName: "Vehicles",
        SubCategoryId: 110,
        SubCategoryName: "Cars",
        Type: "Compact"
    },
    {
        CategoryId: 100,
        CategoryName: "Vehicles",
        SubCategoryId: 110,
        SubCategoryName: "Cars",
        Type: "Midsize"
    },
    {
        CategoryId: 100,
        CategoryName: "Vehicles",
        SubCategoryId: 110,
        SubCategoryName: "Cars",
        Type: "Large Sedan"
    },
    {
        CategoryId: 100,
        CategoryName: "Vehicles",
        SubCategoryId: 110,
        SubCategoryName: "Cars",
        Type: "Classic"
    },
    {
        CategoryId: 100,
        CategoryName: "Vehicles",
        SubCategoryId: 120,
        SubCategoryName: "Trucks",
        Type: "Small Pickup Trucks"
    },
    {
        CategoryId: 100,
        CategoryName: "Vehicles",
        SubCategoryId: 120,
        SubCategoryName: "Trucks",
        Type: "1/2 Ton Trucks"
    },
    {
        CategoryId: 100,
        CategoryName: "Vehicles",
        SubCategoryId: 120,
        SubCategoryName: "Trucks",
        Type: "1 ton Trucks"
    },
    {
        CategoryId: 100,
        CategoryName: "Vehicles",
        SubCategoryId: 120,
        SubCategoryName: "Trucks",
        Type: "4x4 Off-road Trucks"
    },
    {
        CategoryId: 100,
        CategoryName: "Vehicles",
        SubCategoryId: 120,
        SubCategoryName: "Trucks",
        Type: "Specialty Sport Truck"
    },
    {
        CategoryId: 100,
        CategoryName: "Vehicles",
        SubCategoryId: 130,
        SubCategoryName: "Motorcycles",
        Type: "Scooter"
    },
    {
        CategoryId: 100,
        CategoryName: "Vehicles",
        SubCategoryId: 130,
        SubCategoryName: "Motorcycles",
        Type: "Touring Bike"
    },
    {
        CategoryId: 100,
        CategoryName: "Vehicles",
        SubCategoryId: 130,
        SubCategoryName: "Motorcycles",
        Type: "Sport Bike"
    },
    {
        CategoryId: 100,
        CategoryName: "Vehicles",
        SubCategoryId: 130,
        SubCategoryName: "Motorcycles",
        Type: "Chopper"
    },
    {
        CategoryId: 200,
        CategoryName: "Games",
        SubCategoryId: 210,
        SubCategoryName: "Arcade",
        Type: "Pinball Machine"
    },
    {
        CategoryId: 200,
        CategoryName: "Games",
        SubCategoryId: 210,
        SubCategoryName: "Arcade",
        Type: "Full-size 2 player"
    },
    {
        CategoryId: 200,
        CategoryName: "Games",
        SubCategoryId: 210,
        SubCategoryName: "Arcade",
        Type: "Full-size 4 player"
    },
    {
        CategoryId: 200,
        CategoryName: "Games",
        SubCategoryId: 210,
        SubCategoryName: "Arcade",
        Type: "Cocktail Table"
    },
    {
        CategoryId: 200,
        CategoryName: "Games",
        SubCategoryId: 210,
        SubCategoryName: "Arcade",
        Type: "Bar Top"
    },
    {
        CategoryId: 200,
        CategoryName: "Games",
        SubCategoryId: 220,
        SubCategoryName: "Console",
        Type: "Super Nintendo"
    },
    {
        CategoryId: 200,
        CategoryName: "Games",
        SubCategoryId: 220,
        SubCategoryName: "Console",
        Type: "Sega Genesis"
    },
    {
        CategoryId: 200,
        CategoryName: "Games",
        SubCategoryId: 220,
        SubCategoryName: "Console",
        Type: "Sony Playstation"
    },
    {
        CategoryId: 200,
        CategoryName: "Games",
        SubCategoryId: 220,
        SubCategoryName: "Console",
        Type: "TurboGrafx 16"
    },
    {
        CategoryId: 200,
        CategoryName: "Games",
        SubCategoryId: 220,
        SubCategoryName: "Console",
        Type: "3DO"
    },
    {
        CategoryId: 200,
        CategoryName: "Games",
        SubCategoryId: 220,
        SubCategoryName: "Console",
        Type: "Atari 2600"
    },
    {
        CategoryId: 200,
        CategoryName: "Games",
        SubCategoryId: 230,
        SubCategoryName: "Computer",
        Type: "IBM PC"
    },
    {
        CategoryId: 200,
        CategoryName: "Games",
        SubCategoryId: 230,
        SubCategoryName: "Computer",
        Type: "Amiga"
    },
    {
        CategoryId: 200,
        CategoryName: "Games",
        SubCategoryId: 230,
        SubCategoryName: "Computer",
        Type: "Macintosh"
    },
    {
        CategoryId: 200,
        CategoryName: "Games",
        SubCategoryId: 230,
        SubCategoryName: "Computer",
        Type: "Commodore 64"
    },
    {
        CategoryId: 200,
        CategoryName: "Games",
        SubCategoryId: 230,
        SubCategoryName: "Computer",
        Type: "Apple IIGS"
    },
    {
        CategoryId: 200,
        CategoryName: "Games",
        SubCategoryId: 240,
        SubCategoryName: "Table Games",
        Type: "Board Games"
    },
    {
        CategoryId: 200,
        CategoryName: "Games",
        SubCategoryId: 240,
        SubCategoryName: "Table Games",
        Type: "Role Playing"
    },
    {
        CategoryId: 200,
        CategoryName: "Games",
        SubCategoryId: 240,
        SubCategoryName: "Table Games",
        Type: "Strategy"
    },
    {
        CategoryId: 200,
        CategoryName: "Games",
        SubCategoryId: 240,
        SubCategoryName: "Table Games",
        Type: "Card"
    },
    {
        CategoryId: 200,
        CategoryName: "Games",
        SubCategoryId: 240,
        SubCategoryName: "Table Games",
        Type: "Dice"
    },
    {
        CategoryId: 300,
        CategoryName: "Homes",
        SubCategoryId: 310,
        SubCategoryName: "Single Family",
        Type: "1 Bedroom"
    },
    {
        CategoryId: 300,
        CategoryName: "Homes",
        SubCategoryId: 310,
        SubCategoryName: "Single Family",
        Type: "2 Bedroom"
    },
    {
        CategoryId: 300,
        CategoryName: "Homes",
        SubCategoryId: 310,
        SubCategoryName: "Single Family",
        Type: "3 Bedroom"
    },
    {
        CategoryId: 300,
        CategoryName: "Homes",
        SubCategoryId: 310,
        SubCategoryName: "Single Family",
        Type: "4+ Bedroom"
    },
    {
        CategoryId: 300,
        CategoryName: "Homes",
        SubCategoryId: 320,
        SubCategoryName: "Attached",
        Type: "1 bedroom"
    },
    {
        CategoryId: 300,
        CategoryName: "Homes",
        SubCategoryId: 320,
        SubCategoryName: "Attached",
        Type: "2 bedroom"
    },
    {
        CategoryId: 300,
        CategoryName: "Homes",
        SubCategoryId: 320,
        SubCategoryName: "Attached",
        Type: "3 bedroom"
    },
    {
        CategoryId: 300,
        CategoryName: "Homes",
        SubCategoryId: 320,
        SubCategoryName: "Attached",
        Type: "4+ Bedroom"
    },
    {
        CategoryId: 300,
        CategoryName: "Homes",
        SubCategoryId: 330,
        SubCategoryName: "Condo",
        Type: "1 Bedroom"
    },
    {
        CategoryId: 300,
        CategoryName: "Homes",
        SubCategoryId: 330,
        SubCategoryName: "Condo",
        Type: "2 Bedroom"
    },
    {
        CategoryId: 300,
        CategoryName: "Homes",
        SubCategoryId: 330,
        SubCategoryName: "Condo",
        Type: "3 Bedroom"
    },
    {
        CategoryId: 300,
        CategoryName: "Homes",
        SubCategoryId: 330,
        SubCategoryName: "Condo",
        Type: "4+ Bedroom"
    },
    {
        CategoryId: 400,
        CategoryName: "Collectibles",
        SubCategoryId: 410,
        SubCategoryName: "Furniture",
        Type: "Table"
    },
    {
        CategoryId: 400,
        CategoryName: "Collectibles",
        SubCategoryId: 410,
        SubCategoryName: "Furniture",
        Type: "Chair"
    },
    {
        CategoryId: 400,
        CategoryName: "Collectibles",
        SubCategoryId: 410,
        SubCategoryName: "Furniture",
        Type: "Bed"
    },
    {
        CategoryId: 400,
        CategoryName: "Collectibles",
        SubCategoryId: 410,
        SubCategoryName: "Furniture",
        Type: "Desk"
    },
    {
        CategoryId: 400,
        CategoryName: "Collectibles",
        SubCategoryId: 410,
        SubCategoryName: "Furniture",
        Type: "Other"
    },
    {
        CategoryId: 400,
        CategoryName: "Collectibles",
        SubCategoryId: 420,
        SubCategoryName: "Toys",
        Type: "Action Figure"
    },
    {
        CategoryId: 400,
        CategoryName: "Collectibles",
        SubCategoryId: 420,
        SubCategoryName: "Toys",
        Type: "Doll"
    },
    {
        CategoryId: 400,
        CategoryName: "Collectibles",
        SubCategoryId: 420,
        SubCategoryName: "Toys",
        Type: "Die Cast Vehicles"
    },
    {
        CategoryId: 400,
        CategoryName: "Collectibles",
        SubCategoryId: 420,
        SubCategoryName: "Toys",
        Type: "Robot"
    },
    {
        CategoryId: 400,
        CategoryName: "Collectibles",
        SubCategoryId: 420,
        SubCategoryName: "Toys",
        Type: "Playset"
    },
    {
        CategoryId: 400,
        CategoryName: "Collectibles",
        SubCategoryId: 420,
        SubCategoryName: "Toys",
        Type: "Model"
    },
    {
        CategoryId: 400,
        CategoryName: "Collectibles",
        SubCategoryId: 420,
        SubCategoryName: "Toys",
        Type: "Other"
    },
    {
        CategoryId: 400,
        CategoryName: "Collectibles",
        SubCategoryId: 430,
        SubCategoryName: "Books",
        Type: "Fiction"
    },
    {
        CategoryId: 400,
        CategoryName: "Collectibles",
        SubCategoryId: 430,
        SubCategoryName: "Books",
        Type: "Non-Fiction"
    },
    {
        CategoryId: 400,
        CategoryName: "Collectibles",
        SubCategoryId: 430,
        SubCategoryName: "Books",
        Type: "Fantasy"
    },
    {
        CategoryId: 400,
        CategoryName: "Collectibles",
        SubCategoryId: 430,
        SubCategoryName: "Books",
        Type: "Biography"
    },
    {
        CategoryId: 400,
        CategoryName: "Collectibles",
        SubCategoryId: 430,
        SubCategoryName: "Books",
        Type: "Romance"
    },
    {
        CategoryId: 400,
        CategoryName: "Collectibles",
        SubCategoryId: 430,
        SubCategoryName: "Books",
        Type: "Classical"
    },
    {
        CategoryId: 400,
        CategoryName: "Collectibles",
        SubCategoryId: 440,
        SubCategoryName: "Clothing",
        Type: "T-Shirt"
    },
    {
        CategoryId: 400,
        CategoryName: "Collectibles",
        SubCategoryId: 440,
        SubCategoryName: "Clothing",
        Type: "Dress"
    },
    {
        CategoryId: 400,
        CategoryName: "Collectibles",
        SubCategoryId: 440,
        SubCategoryName: "Clothing",
        Type: "Pants"
    },
    {
        CategoryId: 400,
        CategoryName: "Collectibles",
        SubCategoryId: 440,
        SubCategoryName: "Clothing",
        Type: "Shirt"
    },
    {
        CategoryId: 400,
        CategoryName: "Collectibles",
        SubCategoryId: 440,
        SubCategoryName: "Clothing",
        Type: "Shoes"
    },
    {
        CategoryId: 400,
        CategoryName: "Collectibles",
        SubCategoryId: 450,
        SubCategoryName: "Nick Nacks",
        Type: "Desk Ornament"
    },
    {
        CategoryId: 400,
        CategoryName: "Collectibles",
        SubCategoryId: 450,
        SubCategoryName: "Nick Nacks",
        Type: "Sculpture"
    },
    {
        CategoryId: 400,
        CategoryName: "Collectibles",
        SubCategoryId: 450,
        SubCategoryName: "Nick Nacks",
        Type: "Hanging Ornament"
    },
    {
        CategoryId: 400,
        CategoryName: "Collectibles",
        SubCategoryId: 450,
        SubCategoryName: "Nick Nacks",
        Type: "Pottery"
    },
    {
        CategoryId: 400,
        CategoryName: "Collectibles",
        SubCategoryId: 450,
        SubCategoryName: "Nick Nacks",
        Type: "Craft Art"
    },
    {
        CategoryId: 400,
        CategoryName: "Collectibles",
        SubCategoryId: 450,
        SubCategoryName: "Nick Nacks",
        Type: "Painting"
    },
    {
        CategoryId: 400,
        CategoryName: "Collectibles",
        SubCategoryId: 450,
        SubCategoryName: "Nick Nacks",
        Type: "Other"
    }
];

const DemoData = [
    {
        "hiddenColumnData": "This is hidden",
        "Id": 1,
        "ItemId": 1101,
        "ItemName": "CastleVania IV",
        "CategoryId": 200,
        "CategoryName": "Games",
        "SubCategoryId": 220,
        "SubCategoryName": "Console",
        "Type": "Super Nintendo",
        "Description": "Fun action platformer in box and factory sealed.",
        "ForSale": false,
        "AuctionCode": "",
        "AuctionDetail": "",
        "Arcade Collectors_IsMember": true ,
        "Arcade Collectors_StatCode": 203,
        "Arcade Collectors_StatusDesc": "Gold Membership",
        "The Toy Zone_IsMember": true,
        "The Toy Zone_StatCode": 203,
        "The Toy Zone_StatusDesc": "Gold Membership"
    },
    {
        "hiddenColumnData": "",
        "Id": 2,
        "ItemId": "1313",
        "ItemName": "Streets of Rage",
        "CategoryId": 200,
        "CategoryName": "Games",
        "SubCategoryId": 220,
        "SubCategoryName": "Console",
        "Type": "Sega Genesis",
        "Description": "Beat'em up. Used but in perfect condition. Have box and manual.",
        "ForSale": false,
        "AuctionCode": "",
        "AuctionDetail": "",
        "The Toy Zone_IsMember": true,
        "The Toy Zone_StatCode": 101,
        "The Toy Zone_StatusDesc": "Basic Membership"
    },
    {
        "hiddenColumnData": "This is cool.",
        "Id": 3,
        "ItemId": "1555",
        "ItemName": "Tron",
        "CategoryId": 200,
        "CategoryName": "Games",
        "SubCategoryId": 210,
        "SubCategoryName": "Arcade Games",
        "Type": "Full-size 2 player",
        "Description": "Works perfectly. Minor wear and tear on cabinet.",
        "ForSale": true,
        "AuctionCode": "2222 - Game Auctions",
        "AuctionDetail": `Arcade & Video Game Auctions Inc.
    • Auctions are held once a week on Wednesdays. Auction times are 10AM, 12PM, 2PM, and 4PM.`,
        "Arcade Collectors_IsMember": true,
        "Arcade Collectors_StatCode": 204,
        "Arcade Collectors_StatusDesc": "Platinum Membership"
    },
    {
        "hiddenColumnData": "",
        "Id": 4,
        "ItemId": 2011,
        "ItemName": "1965 Mustang Fastback",
        "CategoryId": 100,
        "CategoryName": "Vehicles",
        "SubCategoryId": 110,
        "SubCategoryName": "Cars",
        "Type": "Classic",
        "Description": "65 Mustang Fastback, red with black interior. 289 high performance engine. manual 4 speed transmission.",
        "ForSale": true,
        "AuctionCode": "4422 - Automotive Auction",
        "AuctionDetail": `Mecum Auto Auctions
    • Times and dates vary. Check official schedule for coming auctions.
    • Auction entry fee is $500 plus 6% commission on sales.
    • All vehicles are accepted.`,
        "Auto Club_IsMember": true,
        "Auto Club_StatCode": 301,
        "Auto Club_StatusDesc": "Special VIP Membership"
    },
    {
        "hiddenColumnData": "Hide me now!",
        "Id": 5,
        "ItemId": 3011,
        "ItemName": "Classical Table",
        "CategoryId": 400,
        "CategoryName": "Collectibles",
        "SubCategoryId": 410,
        "SubCategoryName": "Furniture",
        "Type": "Table",
        "Description": "Antique table from the 1800's. Dark oak with ornate accents.",
        "ForSale": false,
        "AuctionCode": "",
        "AuctionDetail": ""
    },
    {
        "hiddenColumnData": "",
        "Id": 6,
        "ItemId": "3344",
        "ItemName": "GI-Joe Cobra Commander",
        "CategoryId": 400,
        "CategoryName": "Collectibles",
        "SubCategoryId": 420,
        "SubCategoryName": "Toys",
        "Type": "Action Figure",
        "Description": "Series 1 Cobra Commander figure. Near perfect condition with minor scratch on face shield.",
        "ForSale": false,
        "AuctionCode": "",
        "AuctionDetail": "",
        "The Toy Zone_IsMember": true,
        "The Toy Zone_StatCode": 202,
        "The Toy Zone_StatusDesc": "Silver Membership"
    },
    {
        "hiddenColumnData": "",
        "Id": 7,
        "ItemId": 75155,
        "ItemName": "Batman Play Set",
        "CategoryId": 400,
        "CategoryName": "Collectibles",
        "SubCategoryId": 420,
        "SubCategoryName": "Toys",
        "Type": "Playset",
        "Description": "Old Batman playset from the 1970's.",
        "ForSale": false,
        "AuctionCode": "",
        "AuctionDetail": "",
        "The Toy Zone_IsMember": true,
        "The Toy Zone_StatCode":101 ,
        "The Toy Zone_StatusDesc": "Basic Membership"
    },
    {
        "hiddenColumnData": "Totally Awesome",
        "Id": 8,
        "ItemId": 4217,
        "ItemName": "1990 Corvette ZR1",
        "CategoryId": 100,
        "CategoryName": "Vehicles",
        "SubCategoryId": 110,
        "SubCategoryName": "Cars",
        "Type": "Sports Car",
        "Description": "Red 1990 Corvette ZR1. 25,000 miles on odometer. Excellant condition with no issues.",
        "ForSale": false,
        "AuctionCode": "",
        "AuctionDetail": "",
        "Auto Club_IsMember": true,
        "Auto Club_StatCode": 203,
        "Auto Club_StatusDesc": "Gold Membership"
    },
    {
        "hiddenColumnData": "",
        "Id": 9,
        "ItemId": "2222",
        "ItemName": "2021 Ram TRX",
        "CategoryId": 100,
        "CategoryName": "Vehicles",
        "SubCategoryId": 120,
        "SubCategoryName": "Trucks",
        "Type": "Specialty Sport Truck",
        "Description": "Brand new 2021 Ram TRX with 702 HP HellCat engine. Black with brown leather interior.",
        "ForSale": true,
        "AuctionCode": "4422 - Automotive Auction",
        "AuctionDetail": `Mecum Auto Auctions
    • Times and dates vary. Check official schedule for coming auctions.
    • Auction entry fee is $500 plus 6% commission on sales.
    • All vehicles are accepted.`
    },
    {
        "hiddenColumnData": "Hide me now or else.",
        "Id": 10,
        "ItemId": 5511,
        "ItemName": "Megatron Transformer",
        "CategoryId": 400,
        "CategoryName": "Collectibles",
        "SubCategoryId": 420,
        "SubCategoryName": "Toys",
        "Type": "Action Figure",
        "Description": "Megatron transformer original series from 1980's.",
        "ForSale": true,
        "AuctionCode": "1131 - Toy Auctions",
        "AuctionDetail": `Toy & Game Collectors Expo
    • Auctions are held Tue, Thr, Fri, from 10:00 AM to 3:00 PM
    • All toys from any eara are accepted`,
        "The Toy Zone_IsMember": true,
        "The Toy Zone_StatCode": 203,
        "The Toy Zone_StatusDesc": "Gold Membership"
    },
    {
        "hiddenColumnData": "",
        "Id": 11,
        "ItemId": 3357,
        "ItemName": "Super Street Fighter II",
        "CategoryId": 200,
        "CategoryName": "Games",
        "SubCategoryId": 210,
        "SubCategoryName": "Arcade Games",
        "Type": "Full-size 2 player",
        "Description": "Original Super Street Fighter II cabinet. Game works but has sound issues. Cabinet is in great shape.",
        "ForSale": true,
        "AuctionCode": "2222 - Game Auctions",
        "AuctionDetail": `Arcade & Video Game Auctions Inc.
    • Auctions are held once a week on Wednesdays. Auction times are 10AM, 12PM, 2PM, and 4PM.`,
        "Arcade Collectors_IsMember": true,
        "Arcade Collectors_StatCode": 201,
        "Arcade Collectors_StatusDesc": "Bronze Membership"
    },
    {
        "hiddenColumnData": "",
        "Id": 12,
        "ItemId": 817,
        "ItemName": "20,000 Leagues Under The Sea",
        "CategoryId": 400,
        "CategoryName": "Collectibles",
        "SubCategoryId": 430,
        "SubCategoryName": "Books",
        "Type": "Fiction",
        "Description": "1st printing in good condition. Was signed by the author.",
        "ForSale": true,
        "AuctionCode": "1020 - Collectable Auction",
        "AuctionDetail": `Nick Nacks and Stuff Collectors Auction
    • Auction days and times vary. check website for available times and to register. The auction site web address is www.nandncollectors.com.`
    },
    {
        "hiddenColumnData": "",
        "Id": 13,
        "ItemId": 1234,
        "ItemName": "Bonks Adventure",
        "CategoryId": 200,
        "CategoryName": "Games",
        "SubCategoryId": 220,
        "SubCategoryName": "Console Games",
        "Type": "TurboGrafx 16",
        "Description": "Original game card without the case. Good working condition.",
        "ForSale": false,
        "AuctionCode": "",
        "AuctionDetail": ""
    },
    {
        "hiddenColumnData": "",
        "Id": 14,
        "ItemId": 901,
        "ItemName": "Beastie Boys Tour Shirt",
        "CategoryId": 400,
        "CategoryName": "Collectibles",
        "SubCategoryId": 440,
        "SubCategoryName": "Clothing",
        "Type": "T-Shirt",
        "Description": "Original tour shirt of the 1980's. Shirt is black with Beastie Boys on front.",
        "ForSale": false,
        "AuctionCode": "",
        "AuctionDetail": ""
    },
    {
        "hiddenColumnData": "",
        "Id": 15,
        "ItemId": 6571,
        "ItemName": "2015 BMW M5",
        "CategoryId": 100,
        "CategoryName": "Vehicles",
        "SubCategoryId": 110,
        "SubCategoryName": "Cars",
        "Type": "Midsize",
        "Description": "Silver BMW M5 with tan leather interior. 67,000 miles on odomoter.",
        "ForSale": false,
        "AuctionCode": "",
        "AuctionDetail": "",
        "Auto Club_IsMember": true,
        "Auto Club_StatCode": 203,
        "Auto Club_StatusDesc": "Gold Membership"
    },
    {
        "hiddenColumnData": "",
        "Id": 16,
        "ItemId": 1639,
        "ItemName": "Kings Quest 7",
        "CategoryId": 200,
        "CategoryName": "Games",
        "SubCategoryId": 230,
        "SubCategoryName": "Computer Games",
        "Type": "IBM PC",
        "Description": "Original game on CD-ROM. Includes box and manual.",
        "ForSale": false,
        "AuctionCode": "",
        "AuctionDetail": ""
    },
    {
        "hiddenColumnData": "",
        "Id": 17,
        "ItemId": 3040,
        "ItemName": "Pac-Man",
        "CategoryId": 200,
        "CategoryName": "Games",
        "SubCategoryId": 210,
        "SubCategoryName": "Arcade Games",
        "Type": "Cocktail table",
        "Description": "1984 Pac Man cocktail table. Perfect working condition with wood grain cabinet.",
        "ForSale": true,
        "AuctionCode": "2222 - Game Auctions",
        "AuctionDetail": `Arcade & Video Game Auctions Inc.
    • Auctions are held once a week on Wednesdays. Auction times are 10AM, 12PM, 2PM, and 4PM.`,
        "Arcade Collectors_IsMember": true,
        "Arcade Collectors_StatCode": 204,
        "Arcade Collectors_StatusDesc": "Platinum Membership",
        "The Toy Zone_IsMember": true,
        "The Toy Zone_StatCode": 101,
        "The Toy Zone_StatusDesc": "Basic Membership",
    },
    {
        "hiddenColumnData": "",
        "Id": 18,
        "ItemId": 9919,
        "ItemName": "Mountain Cottage",
        "CategoryId": 300,
        "CategoryName": "Homes",
        "SubCategoryId": 310,
        "SubCategoryName": "Single Family",
        "Type": "3 Bedroom",
        "Description": "Nice summer cottage in the Sierra Nevada mountians at Pondorosa, CA. Cottage is painted white with hard wood floors. Has 3 car guarage and basement.",
        "ForSale": true,
        "AuctionCode": "3618 - Home Auction",
        "AuctionDetail": "Remax Home Auctions"
    }
];

export { CollectorGroups, AuctionInfo, MemberStatus, ItemType, DemoData };

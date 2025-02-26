from pymongo import MongoClient
from rasa_sdk import Action
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet

# Kết nối MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["karaoke"]  # Tên database
karaoke_collection = db["karaokes"]  # Collection chứa thông tin phòng
dat_phong_collection = db["dat_phong"]  # Collection chứa lịch đặt phòng

class ActionChaoHoi(Action):
    def name(self):
        return "action_chao_hoi"

    def run(self, dispatcher: CollectingDispatcher, tracker, domain):
        dispatcher.utter_message("Chào bạn! Bạn muốn tìm phòng vào ngày nào?")
        return []




class ActionTimKiemPhong(Action):
    def name(self):
        return "action_tim_kiem_phong"

    def run(self, dispatcher: CollectingDispatcher, tracker, domain):
        ngay = tracker.get_slot("ngay")
        gio = tracker.get_slot("gio")
        so_nguoi = tracker.get_slot("so_nguoi")
        print(f"Giá trị so_nguoi lấy từ tracker: {so_nguoi}")  # In giá trị để kiểm tra

 # Loại bỏ phần "người" nếu có trong chuỗi so_nguoi
        if so_nguoi is not None:
            so_nguoi = so_nguoi.replace("người", "").strip()

        if so_nguoi.isdigit():  # Kiểm tra nếu so_nguoi có thể chuyển thành số
            so_nguoi_int = int(so_nguoi)
        else:
            so_nguoi_int = 0  # Giá trị mặc định nếu không hợp lệ

        gio_int = int(gio.replace('h', '').split(":")[0])  # Loại bỏ 'h' và chuyển giờ thành số nguyên

        print(f"Ngày: {ngay}, Giờ: {gio_int}, Số người int: {so_nguoi_int}")

        # Truy vấn MongoDB để tìm phòng trống có giá phù hợp theo giờ
        phong_trong_list = list(karaoke_collection.aggregate([
            { "$unwind": "$phong" },
            { "$unwind": "$phong.gia_theo_gio" },
            { 
                "$addFields": {
                    "ten_karaoke": "$ten_quan"  # Giữ lại tên quán karaoke sau khi unwind
                }
            },
            { 
                "$project": {
                    "ten_karaoke": 1,  # Giữ tên quán karaoke
                    "ten_phong": "$phong.ten_phong",
                    "gio_bat_dau": "$phong.gia_theo_gio.gio_bat_dau",
                    "gio_ket_thuc": "$phong.gia_theo_gio.gio_ket_thuc",
                    "gia": "$phong.gia_theo_gio.gia",
                    "gio_bat_dau_minutes": {
                        "$add": [
                            { "$multiply": [{ "$toInt": { "$substr": ["$phong.gia_theo_gio.gio_bat_dau", 0, 2] } }, 60] },
                            { "$toInt": { "$substr": ["$phong.gia_theo_gio.gio_bat_dau", 3, 2] } }
                        ]
                    },
                    "gio_ket_thuc_minutes": {
                        "$add": [
                            { "$multiply": [{ "$toInt": { "$substr": ["$phong.gia_theo_gio.gio_ket_thuc", 0, 2] } }, 60] },
                            { "$toInt": { "$substr": ["$phong.gia_theo_gio.gio_ket_thuc", 3, 2] } }
                        ]
                    },
                    "suc_chua": "$phong.suc_chua",
                    "trang_thai": "$phong.trang_thai"
                }
            },
            { 
                "$project": {
                    "ten_karaoke": 1,  # Giữ lại tên quán karaoke
                    "ten_phong": 1,
                    "gio_bat_dau_minutes": 1,
                    "gio_ket_thuc_minutes": {
                        "$cond": {
                            "if": { "$gte": ["$gio_ket_thuc_minutes", "$gio_bat_dau_minutes"] },
                            "then": "$gio_ket_thuc_minutes",
                            "else": { "$add": ["$gio_ket_thuc_minutes", 1440] }  # Cộng thêm 24 giờ (1440 phút) nếu qua đêm
                        }
                    },
                    "gia": 1,
                    "suc_chua": 1,
                    "trang_thai": 1
                }
            },
            { 
                "$match": {
                    "suc_chua": { "$gte": so_nguoi_int },  # Phòng chứa đủ số người
                    "trang_thai": "trong",    # Phòng đang trống
                    "gia": { "$ne": None },   # Phòng có giá theo giờ
                    "$or": [
                        { 
                            "gio_bat_dau_minutes": { "$lte": gio_int * 60 },  # Giờ bắt đầu <= giờ yêu cầu
                            "gio_ket_thuc_minutes": { "$gt": gio_int * 60 }    # Giờ kết thúc > giờ yêu cầu
                        },
                        { 
                            "gio_bat_dau_minutes": { "$gt": gio_int * 60 },   # Giờ bắt đầu > giờ yêu cầu
                            "gio_ket_thuc_minutes": { "$lt": gio_int * 60 }    # Giờ kết thúc < giờ yêu cầu
                        }
                    ]
                }
            }
        ]))

      # Kiểm tra nếu phong_trong_list không phải là None hoặc rỗng
        if phong_trong_list is None or len(phong_trong_list) == 0:
            dispatcher.utter_message(f"Không có kết quả phòng trống cho {so_nguoi} người vào {ngay} lúc {gio}.")
            return []

        # In kết quả của phong_trong_list để kiểm tra
        # print(f"Phong trong list: {phong_trong_list}")

        # Xử lý danh sách phòng trống
        rooms = [f"{phong['ten_phong']} ({phong['ten_karaoke']})" for phong in phong_trong_list]


        # In ra danh sách các phòng trống tìm thấy
        # print(f"Các phòng trống tìm thấy: {rooms}")
        
        # Phản hồi kết quả
        if rooms:
            room_list = ", ".join(rooms)
            dispatcher.utter_message(f"Các phòng trống cho {so_nguoi} người vào {ngay} lúc {gio}: {room_list}.")
        else:
            dispatcher.utter_message(f"Xin lỗi, không có phòng phù hợp vào {ngay} lúc {gio}.")

        return []





class ActionDatPhong(Action):
    def name(self):
        return "action_dat_phong"

    def run(self, dispatcher: CollectingDispatcher, tracker, domain):
        ngay = tracker.get_slot("ngay")
        gio = tracker.get_slot("gio")
        so_nguoi = tracker.get_slot("so_nguoi")
        user_id = tracker.get_slot("user_id")  # Lấy từ metadata frontend gửi lên

        # Kiểm tra dữ liệu hợp lệ
        if not ngay or not gio or not so_nguoi or not user_id or not so_nguoi.isdigit():
            dispatcher.utter_message("Vui lòng cung cấp đầy đủ thông tin ngày, giờ, số người và đăng nhập trước khi đặt phòng.")
            return []

        so_nguoi_int = int(so_nguoi)
        gio_int = int(gio.split(":")[0])  # Chuyển "HH:mm" -> HH

        # Truy vấn MongoDB để tìm phòng trống giống như trong action_tim_kiem_phong
        phong_trong = karaoke_collection.aggregate([
            {
                "$match": {
                    "phong": {
                        "$elemMatch": {
                            "suc_chua": {"$gte": so_nguoi_int},
                            "trang_thai": "trong",
                            "gia_theo_gio": {
                                "$elemMatch": {
                                    "$or": [
                                        # Điều kiện giờ thông thường
                                        {
                                            "$and": [
                                                {"$lte": ["$gio_bat_dau", gio_int]},
                                                {"$gt": ["$gio_ket_thuc", gio_int]}
                                            ]
                                        },
                                        # Điều kiện giờ qua đêm
                                        {
                                            "$and": [
                                                {"$gt": ["$gio_bat_dau", "$gio_ket_thuc"]},
                                                {
                                                    "$or": [
                                                        {"$gte": ["$gio_bat_dau", gio_int]},
                                                        {"$lt": ["$gio_ket_thuc", gio_int]}
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    }
                }
            },
            {
                "$project": {
                    "ten_karaoke": 1,
                    "phong": {
                        "$filter": {
                            "input": "$phong",
                            "as": "p",
                            "cond": {
                                "$and": [
                                    {"$gte": ["$$p.suc_chua", so_nguoi_int]},
                                    {"$eq": ["$$p.trang_thai", "trong"]},
                                    {
                                        "$gt": [
                                            {
                                                "$size": {
                                                    "$filter": {
                                                        "input": "$$p.gia_theo_gio",
                                                        "as": "g",
                                                        "cond": {
                                                            "$or": [
                                                                {
                                                                    "$and": [
                                                                        {"$lte": ["$$g.gio_bat_dau", gio_int]},
                                                                        {"$gt": ["$$g.gio_ket_thuc", gio_int]}
                                                                    ]
                                                                },
                                                                {
                                                                    "$and": [
                                                                        {"$gt": ["$$g.gio_bat_dau", "$$g.gio_ket_thuc"]},
                                                                        {
                                                                            "$or": [
                                                                                {"$gte": ["$$g.gio_bat_dau", gio_int]},
                                                                                {"$lt": ["$$g.gio_ket_thuc", gio_int]}
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    }
                                                }
                                            },
                                            0
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        ])

        # Lấy phòng trống đầu tiên từ danh sách
        phong_trong_list = list(phong_trong)
        if not phong_trong_list:
            dispatcher.utter_message(f"Không có phòng trống vào {ngay} lúc {gio}.")
            return []

        karaoke_chon = phong_trong_list[0]  # Chọn quán karaoke đầu tiên tìm thấy
        ten_karaoke = karaoke_chon["ten_karaoke"]
        phong_chon = karaoke_chon["phong"][0]  # Chọn phòng đầu tiên phù hợp

        # Lưu thông tin đặt phòng vào MongoDB
        dat_phong = {
            "phong_id": phong_chon["_id"],
            "karaoke_id": karaoke_chon["_id"],
            "nguoi_dung_id": user_id,
            "thoi_gian_bat_dau": f"{ngay}T{gio}:00:00",
            "trang_thai": "cho_xac_nhan"
        }
        dat_phong_collection.insert_one(dat_phong)

        # Cập nhật trạng thái phòng thành "dang_su_dung"
        karaoke_collection.update_one(
            {"_id": karaoke_chon["_id"], "phong._id": phong_chon["_id"]},
            {"$set": {"phong.$.trang_thai": "dang_su_dung"}}
        )

        dispatcher.utter_message(f"Đặt phòng {phong_chon['ten_phong']} tại {ten_karaoke} thành công! Chờ xác nhận.")
        return [SlotSet("dat_phong_id", str(dat_phong["_id"]))]

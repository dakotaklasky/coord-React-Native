query = db.session.query(UserAttribute)

subquery_height = (
select(UserAttribute.user_id)
.where(UserAttribute.attribute_category == "Height")
.where(UserAttribute.attribute_value <= 188)
.where(UserAttribute.attribute_value >= 99)
)

subquery_gender = (
select(UserAttribute.user_id)
.where(UserAttribute.attribute_category == "Gender")
.where(UserAttribute.attribute_value == "Woman")
)
    
subquery_relationship = (
select(UserAttribute.user_id)
.where(UserAttribute.attribute_category == "Relationship")
.where(UserAttribute.attribute_value == "Non-monogamy")
)

query = query.filter(UserAttribute.user_id.in_(subquery_height)).filter(UserAttribute.user_id.in_(subquery_gender)).filter(UserAttribute.user_id.in_(subquery_relationship))
user_attributes = query.all()
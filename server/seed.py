#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc
from datetime import date

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Like, Match, Preference, PreferenceOption, UserAttribute, Message

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():

        #delete all previous data
        Like.query.delete()
        Match.query.delete()
        Preference.query.delete()
        User.query.delete()
        PreferenceOption.query.delete()
        UserAttribute.query.delete()
        Message.query.delete()

        unique_male_names = set() 
        unique_female_names = set()

        while len(unique_male_names) < 51:
            unique_male_names.add(fake.first_name_male())
        
        while len(unique_female_names) < 101:
            unique_female_names.add(fake.first_name_female())

        # Convert the set to a list if needed
        unique_male_list = list(unique_male_names)
        unique_female_list = list(unique_female_names)
        users = []

        for l in range(1,51):
            user = User(username=fake.user_name(), name = unique_male_list[l],bio = fake.text(), image = f'"../assets/{l}.jpg"')
            user.password_hash = user.username + '123'
            users.append(user)
        
        for q in range(51,101):
            user = User(username=fake.user_name(), name = unique_female_list[q],bio = fake.text(), image = f'"../assets/{q}.jpg"')
            user.password_hash = user.username + '123'
            users.append(user)

        db.session.add_all(users)
        db.session.commit()

        preferences = []
        likes = []
        matches = []
        user_attributes = []
        messages = []

        gender_options = ['Man','Woman','Nonbinary']
        height_options = []
        for feet in range(4,8):
            for inches in range(0,12):
                height_options.append(f"{feet}'{inches}\"")
        ethnicity_options = ['Black/African Descent','East Asian','Hispanic/Latino','Middle Eastern', 'Native American','Pacific Islander', 'South Asian', 'Southeast Asian', 'White/Caucasian','Other']
        religion_options = ['Agnostic','Atheist','Buddhist','Catholic','Christian','Hindu','Jewish','Muslim','Sikh','Spiritual','Other']
        relationship_options = ['Monogamy','Non-monogamy','Figuring out their relationship type']
        politics_options = ['Liberal','Conservative','Moderate','Agnostic']
        education_options = ['High School','Bachelors','Masters','PhD']

        def generate_random_height():
            feet = fake.random_int(min=5, max=7)
            inches = fake.random_int(min=0, max=11)
            return f"{feet}'{inches}\""
        
        for m in range(1,51):
            attribute_1 = UserAttribute(user_id=m,attribute_category='Gender', attribute_value='Man')
            user_attributes.append(attribute_1)
        
        for g in range(51,101):
            attribute_1 = UserAttribute(user_id=g,attribute_category='Gender', attribute_value='Woman')
            user_attributes.append(attribute_1)

        for k in range(1,101):
            preference_1 = Preference(user_id=k,pref_category='Gender', pref_value=gender_options[fake.random_int(min=0,max=1)])
            # preference_2 = Preference(user_id=k,pref_category='Height',pref_value=fake.random_int(min=90, max=100))
            preference_3 = Preference(user_id=k,pref_category='Age',pref_value=fake.random_int(min=18, max=30))
            # preference_4 = Preference(user_id=k,pref_category='Height',pref_value=fake.random_int(min=150, max=200))
            preference_5 = Preference(user_id=k,pref_category='Age',pref_value=fake.random_int(min=31, max=100))
            # preference_6 = Preference(user_id=k,pref_category='Relationship',pref_value=relationship_options[fake.random_int(min=0,max=2)])
            #preference_7 = Preference(user_id=k,pref_category='Politics',pref_value=politics_options[fake.random_int(min=0,max=3)])
            preferences.append(preference_1)
            # preferences.append(preference_2)
            preferences.append(preference_3)
            # preferences.append(preference_4)
            preferences.append(preference_5)
            # preferences.append(preference_6)
            #preferences.append(preference_7)
             
            attribute_2 = UserAttribute(user_id=k,attribute_category='Height',attribute_value=generate_random_height())
            attribute_3 = UserAttribute(user_id=k,attribute_category='Birthdate', attribute_value=fake.date_between(start_date=date(1944,1,1), end_date=date(2005,12,31)).isoformat() )
            attribute_4 = UserAttribute(user_id=k,attribute_category='Ethnicity',attribute_value=ethnicity_options[fake.random_int(min=0,max=9)])
            attribute_5 = UserAttribute(user_id=k,attribute_category='Religion',attribute_value=religion_options[fake.random_int(min=0,max=10)])
            attribute_6 = UserAttribute(user_id=k,attribute_category='Relationship',attribute_value=relationship_options[fake.random_int(min=0,max=2)])
            attribute_7 = UserAttribute(user_id=k,attribute_category='Politics',attribute_value=politics_options[fake.random_int(min=0,max=3)])
            attribute_8 = UserAttribute(user_id=k,attribute_category='Education',attribute_value=education_options[fake.random_int(min=0,max=3)])

            user_attributes.append(attribute_2)
            user_attributes.append(attribute_3)
            user_attributes.append(attribute_4)
            user_attributes.append(attribute_5)
            user_attributes.append(attribute_6)
            user_attributes.append(attribute_7)
            user_attributes.append(attribute_8)
           

        for j in range(4,90):       
            like_1 = Like(matcher_id=j,matchee_id=j+2,accepted=-1)
            like_2 = Like(matcher_id=j,matchee_id=j+4, accepted=1)
            like_3 = Like(matcher_id=j,matchee_id=j+6, accepted=1)
            likes.append(like_1)
            likes.append(like_2)
            likes.append(like_3)

            match_1 = Match(matcher_id=j,matchee_id=j+3)
            match_2 = Match(matcher_id=j,matchee_id=j-3)
            likes.append(match_1)
            likes.append(match_2)

            message_1 = Message(user_id= j, messagee=j-3, message=fake.text(), time=fake.date_time_between(start_date=date(2023,1,1), end_date=date(2024,10,20)).isoformat())
            message_2 = Message(user_id= j, messagee=j+3, message=fake.text(), time=fake.date_time_between(start_date=date(2023,1,1), end_date=date(2024,10,20)).isoformat())
            messages.append(message_1)
            messages.append(message_2)
            message_4 = Message(user_id= j, messagee=j-3, message=fake.text(), time=fake.date_time_between(start_date=date(2023,1,1), end_date=date(2024,10,20)).isoformat())
            message_5 = Message(user_id= j, messagee=j+3, message=fake.text(), time=fake.date_time_between(start_date=date(2023,1,1), end_date=date(2024,10,20)).isoformat())
            messages.append(message_4)
            messages.append(message_5)
            message_7 = Message(user_id= j, messagee=j-3, message=fake.text(), time=fake.date_time_between(start_date=date(2023,1,1), end_date=date(2024,10,20)).isoformat())
            message_8 = Message(user_id= j, messagee=j+3, message=fake.text(), time=fake.date_time_between(start_date=date(2023,1,1), end_date=date(2024,10,20)).isoformat())
            messages.append(message_7)
            messages.append(message_8)
            message_10 = Message(user_id= j, messagee=j-3, message=fake.text(), time=fake.date_time_between(start_date=date(2023,1,1), end_date=date(2024,10,20)).isoformat())
            message_11 = Message(user_id= j, messagee=j+3, message=fake.text(), time=fake.date_time_between(start_date=date(2023,1,1), end_date=date(2024,10,20)).isoformat())
            messages.append(message_10)
            messages.append(message_11)

        pref_options = []
        pref_option1 = PreferenceOption(category='Gender',input_type='dropdown',options=",".join(gender_options), icon="person-outline")
        pref_option2 = PreferenceOption(category='Height',input_type='interval',options=",".join(height_options), minval=48, maxval=84, icon="stats-chart-outline")
        pref_option3 = PreferenceOption(category='Age', input_type='interval',minval=18, maxval = 100, icon="balloon-outline")
        pref_option4 = PreferenceOption(category='Ethnicity',input_type='dropdown', options=",".join(ethnicity_options),icon="earth-outline")
        pref_option5 = PreferenceOption(category='Religion',input_type='dropdown',options=",".join(religion_options), icon="globe-outline")
        pref_option6 = PreferenceOption(category='Relationship',input_type='dropdown', options=",".join(relationship_options),icon="people-outline")
        pref_option7= PreferenceOption(category='Politics',input_type='dropdown',options=",".join(politics_options),icon="glasses-outline")
        pref_option8 = PreferenceOption(category='Education',input_type='dropdown',options=",".join(education_options),icon="book-outline")

        pref_options.append(pref_option1)
        pref_options.append(pref_option2)
        pref_options.append(pref_option3)
        pref_options.append(pref_option4)
        pref_options.append(pref_option5)
        pref_options.append(pref_option6)
        pref_options.append(pref_option7)
        pref_options.append(pref_option8)

        db.session.add_all(preferences)
        db.session.add_all(likes)
        db.session.add_all(matches)
        db.session.add_all(pref_options)
        db.session.add_all(user_attributes)
        db.session.add_all(messages)
        db.session.commit()


            

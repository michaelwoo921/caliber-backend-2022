drop table if exists categories cascade;
drop table if exists qcweeks cascade;
drop table if exists weekcategories cascade;
drop table if exists qcnotes cascade;


create table categories
(
  id serial primary key
  skill text not null,
  active boolean
)

insert into categories (skill, active)  values 
('React', true),
('Log4js', false),
('TypeScript', true),
('MongoDB', false),
('Jasmine', true),
('AWS Fargate', false),
('AWS Lambda', true),
('Jest', true),
 ('Enzyme', true),

create type STATUS as enum ('Undefined', 'Poor', 'Average', 'Good', 'Superstar');

create table qcweeks 
(
  id serial primary key,
  weeknumber int not null,
  note text,
  overallstatus STATUS,
  batchid text not null,
  unique (batchid, weeknumber)
)

insert into qcweeks (weekNumber, note, overallStatus, batchId)  values 
(1, '', 'Average', 'batch1'),
(5, 'They are making good progress.', 'Good', 'batch2'),
(1, '', 'Undefined', 'batch3'),
(10, '', 'Average', 'batch4'),
(3, 'Drop them all.', 'Poor', 'batch5'),
(6, '', 'Good', 'batch6'),
(3, '', 'Average', 'batch7'),
(8, 'They are doing their best.', 'Poor', 'batch8'),
(4, 'Savants. All of them.', 'Superstar', 'batch9');

create table weekcategories
(
	categoryid int,
	qcweekid int,
	primary key(categoryid, qcweekid)
);

create table qcnotes
(
	id serial primary key,
	weeknumber int not null,
	batchid text not null,
	associateid text not null,
	technicalstatus STATUS,
	notecontent text,
	unique (weeknumber, batchid, associateid)
);

insert into qcnotes (weekNumber, batchId, associateId, technicalStatus, noteContent)  values 
(1, 'batch1', 'associate1', 'Undefined', ''),
(1, 'batch1', 'associate2', 'Average', 'Seems okay so far.'),
(1, 'batch2', 'associate3', 'Poor', ''),
(1, 'batch2', 'associate4', 'Good', 'Shows promise.'),
(1, 'batch3', 'associate5', 'Undefined', ''),
(1, 'batch3', 'associate6', 'Average', 'Meh.'),
(2, 'batch4', 'associate7', 'Average', ''),
(2, 'batch4', 'associate8', 'Poor', 'One foot out the door.'),
(2, 'batch5', 'associate9', 'Good', ''),
(2, 'batch5', 'associate10', 'Average', ''),
(2, 'batch6', 'associate11', 'Superstar', 'I like this guy.'),
(1, 'batch6', 'associate12', 'Average', ''),
(3, 'batch7', 'associate13', 'Good', 'Keep on truckin my dude.'),
(3, 'batch7', 'associate14', 'Good', ''),
(3, 'batch8', 'associate15', 'Poor', 'No Bueno.'),
(3, 'batch8', 'associate16', 'Average', ''),
(3, 'batch9', 'associate17', 'Average', ''),
(3, 'batch9', 'associate18', 'Superstar', 'Better than me.');





alter table weekcategories 
add constraint fk_weekcategoriescategoryid foreign key (categoryid) 
references categories (id) on delete cascade on update cascade;

alter table weekcategories 
add constraint fk_weekcategoriesqcweekid foreign key (qcweekid) 
references qcweeks (id) 
on delete cascade on update cascade;